import { Injectable } from "@angular/core";
import { Classe } from "basenaturaliste-model/classe.object";
import { Commune } from "basenaturaliste-model/commune.object";
import { Departement } from "basenaturaliste-model/departement.object";
import { Donnee } from "basenaturaliste-model/donnee.object";
import { BackendApiService } from "../../shared/services/backend-api.service";
import { CreationModeEnum } from "../helpers/creation-mode.enum";
import { CreationModeHelper } from "../helpers/creation-mode.helper";
import { map } from "rxjs/operators";

@Injectable()
export class NavigationService {
  private SAVED_DONNEE_ID: number = -1;
  private previousDonneeId: number;
  private nextDonneeId: number;
  private nextMode: CreationModeEnum;
  private currentDonneeIndex: number;
  private lastDonneeId: number;
  private numberOfDonnees: number;

  private savedDonnee: Donnee;
  private savedMode: CreationModeEnum;
  private savedDepartement: Departement;
  private savedCommune: Commune;
  private savedClasse: Classe;

  constructor(public backendApiService: BackendApiService) {}

  public init(lastDonnee: Donnee, numberOfDonnees: number): void {
    this.lastDonneeId = lastDonnee ? lastDonnee.id : null;
    this.numberOfDonnees = numberOfDonnees;
    this.resetPreviousAndNextDonnee();
  }

  public resetPreviousAndNextDonnee(): void {
    this.previousDonneeId = this.lastDonneeId;
    this.nextDonneeId = null;
    this.nextMode = null;
    this.currentDonneeIndex = null;
    this.savedDonnee = {} as Donnee;
    this.savedMode = null;
    this.savedClasse = null;
    this.savedDepartement = null;
    this.savedCommune = null;
  }

  public saveCurrentContext(
    donneeToSave: Donnee,
    currentDepartement: Departement,
    currentCommune: Commune,
    currentClasse: Classe
  ): void {
    this.savedDonnee = donneeToSave;
    this.savedMode = CreationModeHelper.getCreationMode();
    this.savedDepartement = currentDepartement;
    this.savedCommune = currentCommune;
    this.savedClasse = currentClasse;
  }

  public updateNavigationAfterADonneeWasCreated = (
    savedDonnee: Donnee
  ): void => {
    this.numberOfDonnees++;
    this.previousDonneeId = savedDonnee.id;
    this.lastDonneeId = savedDonnee.id;
  };

  public updateNavigationAfterADonneeWasDeleted = (): void => {
    if (this.isLastDonneeCurrentlyDisplayed()) {
      // Last donnee was deleted
      this.lastDonneeId = this.previousDonneeId;
      this.currentDonneeIndex = null;
      this.nextDonneeId = null;
      this.nextMode = null;
    }

    this.numberOfDonnees--;

    if (this.currentDonneeIndex) {
      if (!this.isLastDonneeCurrentlyDisplayed()) {
        // We should find the new next donnee
        this.populateNextDonnee(this.nextDonneeId);
      } else {
        this.nextDonneeId = this.SAVED_DONNEE_ID;
        this.nextMode = this.savedMode;
      }
    }
  };

  public updateNavigationAfterPreviousDonneeIsDisplayed = (
    newNextDonnee: Donnee
  ): void => {
    if (!this.currentDonneeIndex) {
      // We are displaying the creation form so the next donnee is the saved donnee
      this.nextDonneeId = this.SAVED_DONNEE_ID;
      this.nextMode = this.savedMode;
      this.currentDonneeIndex = this.numberOfDonnees;
    } else {
      this.currentDonneeIndex--;
      this.nextDonneeId = newNextDonnee ? newNextDonnee.id : null;
      this.nextMode = CreationModeEnum.UPDATE;
    }

    if (this.currentDonneeIndex === 1) {
      // We are displaying the first donnee
      this.previousDonneeId = null;
    } else {
      this.populatePreviousDonnee(this.previousDonneeId);
    }
  };

  public updateNavigationAfterNextDonneeIsDisplayed = (
    newPreviousDonnee: Donnee
  ): void => {
    this.previousDonneeId = newPreviousDonnee ? newPreviousDonnee.id : null;

    // We have displayed the next donnee
    if (this.isLastDonneeCurrentlyDisplayed()) {
      // We were displaying the last donnee so we come back to creation mode
      this.currentDonneeIndex = null;
      this.nextDonneeId = null;
      this.nextMode = null;
    } else {
      // We weren't displaying the last donnee so we increase the index
      this.currentDonneeIndex++;

      if (this.isLastDonneeCurrentlyDisplayed()) {
        // Now last donnee is displayed so next donnee is the donnee saved from the creation form
        this.nextDonneeId = this.SAVED_DONNEE_ID;
        this.nextMode = this.savedMode;
      } else {
        // It is still not the last donnee so we call the back-end to find the next donnee
        this.populateNextDonnee(this.nextDonneeId);
      }
    }
  };

  public updateNavigationAfterSearchDonneeById = (
    index: number,
    previousDonnee: Donnee,
    nextDonnee: Donnee
  ): void => {
    this.currentDonneeIndex = index;
    this.previousDonneeId = previousDonnee ? previousDonnee.id : null;
    this.nextDonneeId = nextDonnee ? nextDonnee.id : null;
    if (this.nextDonneeId == null) {
      this.nextDonneeId = this.SAVED_DONNEE_ID;
      this.nextMode = this.savedMode;
    }
  };

  private populatePreviousDonnee = (id: number): void => {
    this.backendApiService
      .getPreviousDonnee(id)
      .subscribe((previousDonnee: Donnee) => {
        if (!!previousDonnee && !!previousDonnee.id) {
          this.previousDonneeId = previousDonnee ? previousDonnee.id : null;
        }
      });
  };

  public populateNextDonnee(id: number): void {
    this.backendApiService.getNextDonnee(id).subscribe((nextDonnee: Donnee) => {
      if (!!nextDonnee && !!nextDonnee.id) {
        this.nextDonneeId = nextDonnee ? nextDonnee.id : null;
        this.nextMode = CreationModeEnum.UPDATE;
      }
    });
  }

  public getNextMode(): CreationModeEnum {
    return this.nextMode;
  }

  public getNextDonnee(): Promise<Donnee> {
    if (this.nextDonneeId === this.SAVED_DONNEE_ID) {
      return Promise.resolve(this.savedDonnee);
    } else {
      //return Promise.resolve(this.nextDonnee);
      return this.backendApiService
        .getDonneeByIdWithContext(this.nextDonneeId)
        .pipe(map((donnee) => donnee.donnee))
        .toPromise();
    }
  }

  public getPreviousDonnee(): Promise<Donnee> {
    return this.backendApiService
      .getDonneeByIdWithContext(this.previousDonneeId)
      .pipe(map((donnee) => donnee.donnee))
      .toPromise();
  }

  public getSavedDepartement(): Departement {
    return this.savedDepartement;
  }

  public getSavedCommune(): Commune {
    return this.savedCommune;
  }

  public getSavedClasse(): Classe {
    return this.savedClasse;
  }

  private isLastDonneeCurrentlyDisplayed(): boolean {
    return this.numberOfDonnees === this.currentDonneeIndex;
  }

  public hasPreviousDonnee(): boolean {
    // return !!this.previousDonnee;
    return !!this.previousDonneeId;
  }

  public hasNextDonnee(): boolean {
    // return !!this.nextDonnee;
    return !!this.nextDonneeId;
  }

  public getCurrentDonneeIndex(): number {
    return this.currentDonneeIndex;
  }
}
