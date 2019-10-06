import { Injectable } from "@angular/core";
import { Classe } from "basenaturaliste-model/classe.object";
import { Commune } from "basenaturaliste-model/commune.object";
import { Departement } from "basenaturaliste-model/departement.object";
import { Donnee } from "basenaturaliste-model/donnee.object";
import { BackendApiService } from "../../shared/services/backend-api.service";
import { CreationModeEnum } from "../helpers/creation-mode.enum";
import { CreationModeHelper } from "../helpers/creation-mode.helper";
import { DonneeWithNavigationData } from "basenaturaliste-model/donnee-with-navigation-data.object";

@Injectable()
export class NavigationService {
  private CACHED_DONNEE_ID: number = -1;
  private previousDonneeId: number;
  private nextDonneeId: number;
  private nextMode: CreationModeEnum;
  private currentDonneeIndex: number;
  private lastDonneeId: number;
  private numberOfDonnees: number;

  private cachedDonnee: Donnee;
  private cachedMode: CreationModeEnum;
  private cachedDepartement: Departement;
  private cachedCommune: Commune;
  private cachedClasse: Classe;

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
    this.cachedMode = CreationModeHelper.getCreationMode();
    this.cachedDepartement = currentDepartement;
    this.cachedCommune = currentCommune;
    this.cachedClasse = currentClasse;
  }

  public updateNavigationAfterADonneeWasCreated = (
    savedDonnee: Donnee
  ): void => {
    this.numberOfDonnees++;
    this.previousDonneeId = savedDonnee.id;
    this.lastDonneeId = savedDonnee.id;
  };

  public updateNavigationAfterADonneeWasDeleted = (
    newPreviousDonneeId: number,
    newNextDonneeId: number
  ): void => {
    this.previousDonneeId = newPreviousDonneeId;

    if (this.isLastDonneeCurrentlyDisplayed()) {
      // Last donnee was deleted, we go back to creation mode
      this.lastDonneeId = this.previousDonneeId;
      this.currentDonneeIndex = null;
      this.nextDonneeId = null;
      this.nextMode = null;
    }

    this.numberOfDonnees--;

    if (this.currentDonneeIndex) {
      if (!this.isLastDonneeCurrentlyDisplayed()) {
        // We should find the new next donnee
        this.nextDonneeId = newNextDonneeId;
      } else {
        // We are displaying the last donnee
        this.nextDonneeId = this.CACHED_DONNEE_ID;
        this.nextMode = this.cachedMode;
      }
    }
  };

  public updateNavigationAfterPreviousDonneeIsDisplayed = (
    newPreviousDonneeId: number,
    newNextDonneeId: number
  ): void => {
    if (!this.currentDonneeIndex) {
      // We are displaying the creation form so the next donnee is the saved donnee
      this.nextDonneeId = this.CACHED_DONNEE_ID;
      this.nextMode = this.cachedMode;
      this.currentDonneeIndex = this.numberOfDonnees;
    } else {
      this.currentDonneeIndex--;
      this.nextDonneeId = newNextDonneeId;
      this.nextMode = CreationModeEnum.UPDATE;
    }

    if (this.currentDonneeIndex === 1) {
      // We are displaying the first donnee
      this.previousDonneeId = null;
    } else {
      this.previousDonneeId = newPreviousDonneeId;
    }
  };

  public updateNavigationAfterNextDonneeIsDisplayed = (
    newPreviousDonneeId: number,
    newNextDonneeId: number
  ): void => {
    this.previousDonneeId = newPreviousDonneeId;

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
        this.nextDonneeId = this.CACHED_DONNEE_ID;
        this.nextMode = this.cachedMode;
      } else {
        // It is still not the last donnee so we call the back-end to find the next donnee
        this.nextDonneeId = newNextDonneeId;
      }
    }
  };

  public updateNavigationAfterSearchDonneeById = (
    index: number,
    previousDonneeId: number,
    nextDonneeId: number
  ): void => {
    this.currentDonneeIndex = index;
    this.previousDonneeId = previousDonneeId;
    this.nextDonneeId = nextDonneeId;
    if (this.nextDonneeId == null) {
      this.nextDonneeId = this.CACHED_DONNEE_ID;
      this.nextMode = this.cachedMode;
    }
  };

  public getNextMode(): CreationModeEnum {
    return this.nextMode;
  }

  public getNextDonnee(): Promise<DonneeWithNavigationData> {
    const idToRetrieve: number = this.nextDonneeId;
    this.previousDonneeId = null;
    this.nextDonneeId = null;

    if (idToRetrieve === this.CACHED_DONNEE_ID) {
      return this.getLastDonneeId().then((lastDonneeId: number) => {
        this.lastDonneeId = lastDonneeId;
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
    const idToRetrieve: number = this.previousDonneeId;
    this.previousDonneeId = null;
    this.nextDonneeId = null;
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
    return this.numberOfDonnees === this.currentDonneeIndex;
  }

  public hasPreviousDonnee(): boolean {
    return !!this.previousDonneeId;
  }

  public hasNextDonnee(): boolean {
    return !!this.nextDonneeId;
  }

  public getCurrentDonneeIndex(): number {
    return this.currentDonneeIndex;
  }
}
