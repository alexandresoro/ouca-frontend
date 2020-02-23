import { Injectable } from "@angular/core";
import { Classe } from "basenaturaliste-model/classe.object";
import { Commune } from "basenaturaliste-model/commune.object";
import { Departement } from "basenaturaliste-model/departement.object";
import { DonneeWithNavigationData } from "basenaturaliste-model/donnee-with-navigation-data.object";
import { Donnee } from "basenaturaliste-model/donnee.object";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { BackendApiService } from "../../shared/services/backend-api.service";
import { CreationModeEnum } from "../helpers/creation-mode.enum";
import { CreationModeService } from "./creation-mode.service";

@Injectable({
  providedIn: "root"
})
export class NavigationService {
  private readonly CACHED_DONNEE_ID: number = -1;
  private previousDonneeId$: BehaviorSubject<number> = new BehaviorSubject<
    number
  >(null);
  private nextDonneeId$: BehaviorSubject<number> = new BehaviorSubject<number>(
    null
  );
  private nextMode$: BehaviorSubject<CreationModeEnum> = new BehaviorSubject<
    CreationModeEnum
  >(null);
  private currentDonneeIndex$: BehaviorSubject<number> = new BehaviorSubject<
    number
  >(null);
  private lastDonneeId$: BehaviorSubject<number> = new BehaviorSubject<number>(
    null
  );
  private numberOfDonnees$: BehaviorSubject<number> = new BehaviorSubject(null);

  private cachedDonnee: Donnee;
  private cachedMode: CreationModeEnum;
  private cachedDepartement: Departement;
  private cachedCommune: Commune;
  private cachedClasse: Classe;

  constructor(
    public backendApiService: BackendApiService,
    private creationModeService: CreationModeService
  ) {}

  public init(lastDonnee: Donnee, numberOfDonnees: number): void {
    this.lastDonneeId$.next(lastDonnee ? lastDonnee.id : null);
    this.numberOfDonnees$.next(numberOfDonnees);
    this.resetPreviousAndNextDonnee();
  }

  public resetPreviousAndNextDonnee(): void {
    this.previousDonneeId$.next(this.lastDonneeId$.value);
    this.nextDonneeId$.next(null);
    this.nextMode$.next(null);
    this.currentDonneeIndex$.next(null);
    this.cachedDonnee = {} as Donnee;
    this.cachedMode = null;
    this.cachedClasse = null;
    this.cachedDepartement = null;
    this.cachedCommune = null;
  }

  public saveCurrentContext(
    donneeToSave: Donnee,
    currentDepartement: Departement,
    currentCommune: Commune,
    currentClasse: Classe
  ): void {
    this.cachedDonnee = donneeToSave;
    this.cachedMode = this.creationModeService.getCreationMode();
    this.cachedDepartement = currentDepartement;
    this.cachedCommune = currentCommune;
    this.cachedClasse = currentClasse;
  }

  public updateNavigationAfterADonneeWasCreated = (
    savedDonnee: Donnee
  ): void => {
    this.numberOfDonnees$.next(this.numberOfDonnees$.value + 1);
    this.previousDonneeId$.next(savedDonnee.id);
    this.lastDonneeId$.next(savedDonnee.id);
  };

  public updateNavigationAfterADonneeWasDeleted = (
    newPreviousDonneeId: number,
    newNextDonneeId: number
  ): void => {
    this.previousDonneeId$.next(newPreviousDonneeId);

    if (this.isLastDonneeCurrentlyDisplayed()) {
      // Last donnee was deleted, we go back to creation mode
      this.lastDonneeId$.next(this.previousDonneeId$.value);
      this.currentDonneeIndex$.next(null);
      this.nextDonneeId$.next(null);
      this.nextMode$.next(null);
    }

    this.numberOfDonnees$.next(this.numberOfDonnees$.value - 1);

    if (this.currentDonneeIndex$.value) {
      if (!this.isLastDonneeCurrentlyDisplayed()) {
        // We should find the new next donnee
        this.nextDonneeId$.next(newNextDonneeId);
      } else {
        // We are displaying the last donnee
        this.nextDonneeId$.next(this.CACHED_DONNEE_ID);
        this.nextMode$.next(this.cachedMode);
      }
    }
  };

  public updateNavigationAfterPreviousDonneeIsDisplayed = (
    newPreviousDonneeId: number,
    newNextDonneeId: number
  ): void => {
    if (!this.currentDonneeIndex$.value) {
      // We are displaying the creation form so the next donnee is the saved donnee
      this.nextDonneeId$.next(this.CACHED_DONNEE_ID);
      this.nextMode$.next(this.cachedMode);
      this.currentDonneeIndex$.next(this.numberOfDonnees$.value);
    } else {
      this.currentDonneeIndex$.next(this.currentDonneeIndex$.value - 1);
      this.nextDonneeId$.next(newNextDonneeId);
      this.nextMode$.next(CreationModeEnum.UPDATE);
    }

    if (this.currentDonneeIndex$.value === 1) {
      // We are displaying the first donnee
      this.previousDonneeId$.next(null);
    } else {
      this.previousDonneeId$.next(newPreviousDonneeId);
    }
  };

  public updateNavigationAfterNextDonneeIsDisplayed = (
    newPreviousDonneeId: number,
    newNextDonneeId: number
  ): void => {
    this.previousDonneeId$.next(newPreviousDonneeId);

    // We have displayed the next donnee
    if (this.isLastDonneeCurrentlyDisplayed()) {
      // We were displaying the last donnee so we come back to creation mode
      this.currentDonneeIndex$.next(null);
      this.nextDonneeId$.next(null);
      this.nextMode$.next(null);
    } else {
      // We weren't displaying the last donnee so we increase the index
      this.currentDonneeIndex$.next(this.currentDonneeIndex$.value + 1);

      if (this.isLastDonneeCurrentlyDisplayed()) {
        // Now last donnee is displayed so next donnee is the donnee saved from the creation form
        this.nextDonneeId$.next(this.CACHED_DONNEE_ID);
        this.nextMode$.next(this.cachedMode);
      } else {
        // It is still not the last donnee so we call the back-end to find the next donnee
        this.nextDonneeId$.next(newNextDonneeId);
      }
    }
  };

  public updateNavigationAfterSearchDonneeById = (
    index: number,
    previousDonneeId: number,
    nextDonneeId: number
  ): void => {
    this.currentDonneeIndex$.next(index);
    this.previousDonneeId$.next(previousDonneeId);
    this.nextDonneeId$.next(
      nextDonneeId ? nextDonneeId : this.CACHED_DONNEE_ID
    );
    if (!nextDonneeId) {
      this.nextMode$.next(this.cachedMode);
    }
  };

  public getNextMode(): CreationModeEnum {
    return this.nextMode$.value;
  }

  public getNextDonnee(): Promise<DonneeWithNavigationData> {
    const idToRetrieve: number = this.nextDonneeId$.value;
    this.previousDonneeId$.next(null);
    this.nextDonneeId$.next(null);

    if (idToRetrieve === this.CACHED_DONNEE_ID) {
      return this.getLastDonneeId().then((lastDonneeId: number) => {
        this.lastDonneeId$.next(lastDonneeId);
        return Promise.resolve({
          ...this.cachedDonnee,
          previousDonneeId: lastDonneeId,
          nextDonneeId: null,
          indexDonnee: null
        });
      });
    } else {
      return this.backendApiService
        .getDonneeByIdWithContext(idToRetrieve)
        .toPromise();
    }
  }

  public getPreviousDonnee(): Promise<DonneeWithNavigationData> {
    const idToRetrieve: number = this.previousDonneeId$.value;
    this.previousDonneeId$.next(null);
    this.nextDonneeId$.next(null);
    return this.backendApiService
      .getDonneeByIdWithContext(idToRetrieve)
      .toPromise();
  }

  public getLastDonneeId(): Promise<number> {
    return this.backendApiService.getLastDonneeId().toPromise();
  }

  public getSavedDepartement(): Departement {
    return this.cachedDepartement;
  }

  public getSavedCommune(): Commune {
    return this.cachedCommune;
  }

  public getSavedClasse(): Classe {
    return this.cachedClasse;
  }

  private isLastDonneeCurrentlyDisplayed(): boolean {
    return this.numberOfDonnees$.value === this.currentDonneeIndex$.value;
  }

  public hasPreviousDonnee$(): Observable<boolean> {
    return this.previousDonneeId$.pipe(map(previousDonnee => !!previousDonnee));
  }

  public hasNextDonnee$(): Observable<boolean> {
    return this.nextDonneeId$.pipe(map(nextDonneeId => !!nextDonneeId));
  }

  public getCurrentDonneeIndex$(): Observable<number> {
    return this.currentDonneeIndex$;
  }
}
