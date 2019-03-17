import { Injectable } from "@angular/core";
import { Donnee } from "basenaturaliste-model/donnee.object";
import { Inventaire } from "basenaturaliste-model/inventaire.object";
import { BackendApiService } from "../../../shared/services/backend-api.service";
import { CreationModeEnum, CreationModeHelper } from "./creation-mode.enum";

@Injectable()
export class NavigationService {
  public previousDonnee: Donnee;
  public nextDonnee: Donnee;
  public currentDonneeIndex: number;

  public numberOfDonnees: number;

  public savedDonnee: Donnee;
  public savedInventaire: Inventaire;
  public savedMode: CreationModeEnum;

  private inventaireToBeUpdated: Inventaire;

  constructor(
    public backendApiService: BackendApiService,
    public modeHelper: CreationModeHelper
  ) {}

  public init(lastDonnee: Donnee, numberOfDonnees: number): void {
    this.previousDonnee = lastDonnee;
    this.nextDonnee = null;
    this.currentDonneeIndex = null;
    this.numberOfDonnees = numberOfDonnees;
    this.savedDonnee = {} as Donnee;
    this.savedInventaire = {} as Inventaire;
    this.savedMode = null;
  }
  public saveCurrentContext(
    modeToSave: CreationModeEnum,
    inventaireToSave: Inventaire,
    donneeToSave: Donnee
  ): void {
    this.savedDonnee = {} as Donnee;
    this.savedInventaire = {} as Inventaire;

    this.savedMode = modeToSave;

    if (this.modeHelper.isInventaireMode(this.savedMode)) {
      this.savedDonnee.inventaire = inventaireToSave;
    }

    if (this.modeHelper.isDonneeMode(this.savedMode)) {
      this.savedDonnee = donneeToSave;
    }

    console.log("Sauvegarde de la donnée courante", this.savedDonnee);
  }

  public updateNavigationAfterADonneeWasSaved(savedDonnee: Donnee) {
    this.numberOfDonnees++;
    this.previousDonnee = savedDonnee;
  }
  public decreaseIndexOfCurrentDonnee(): void {
    if (!!!this.currentDonneeIndex) {
      this.currentDonneeIndex = this.numberOfDonnees;
    } else {
      this.currentDonneeIndex--;
    }
  }

  public setPreviousDonnee(donnee: Donnee) {
    this.previousDonnee = donnee;
  }

  public setNextDonnee(donnee: Donnee) {
    this.nextDonnee = donnee;
  }

  public updatePreviousAndNextDonnees(
    newCurrentDonnee: Donnee,
    newPreviousDonnee: Donnee,
    newNextDonnee: Donnee
  ): void {
    if (!newPreviousDonnee) {
      // We need to get the new previous donnee from the backend
      const hasPreviousDonnee: boolean = this.currentDonneeIndex > 1;
      if (hasPreviousDonnee) {
        this.backendApiService.getPreviousDonnee(newCurrentDonnee.id).subscribe(
          (previousDonnee: Donnee) => {
            this.setPreviousAndNextDonnees(previousDonnee, newNextDonnee);
          },
          (error: any) => {
            console.error(
              "Impossible de trouver la donnée précédente (" + error + ")"
            );
          }
        );
      } else {
        this.setPreviousAndNextDonnees(null, newNextDonnee);
      }
    } else if (!newNextDonnee) {
      // We need to get the new next donnee from the backend
      if (
        !!this.currentDonneeIndex &&
        this.currentDonneeIndex < this.numberOfDonnees
      ) {
        this.backendApiService.getNextDonnee(newCurrentDonnee.id).subscribe(
          (nextDonnee: Donnee) => {
            this.setPreviousAndNextDonnees(newPreviousDonnee, nextDonnee);
          },
          (error: any) => {
            console.error(
              "Impossible de trouver la donnée suivante (" + error + ")"
            );
          }
        );
      } else if (
        !!this.currentDonneeIndex &&
        this.currentDonneeIndex === this.numberOfDonnees
      ) {
        // We are displaying the donnee just before last donnee, we go the last donnee so the next donnee will
        // be the saved donnee
        this.setPreviousAndNextDonnees(newPreviousDonnee, this.savedDonnee);
      } else {
        // we are displaying the last donnee, we go back to the creation form so there is no next donnee
        this.setPreviousAndNextDonnees(newPreviousDonnee, null);
      }
    }
  }

  private setPreviousAndNextDonnees(
    newPreviousDonnee: Donnee,
    newNextDonnee: Donnee
  ) {
    this.previousDonnee = newPreviousDonnee;
    this.nextDonnee = newNextDonnee;
    console.log("La donnée précédente est", this.previousDonnee);
    console.log("La donnée suivante est", this.nextDonnee);
  }

  public updatePreviousDonnee(currentDonnee: Donnee): void {
    const hasPreviousDonnee: boolean = this.currentDonneeIndex > 1;
    this.previousDonnee = null;
    if (hasPreviousDonnee) {
      this.populatePreviousDonnee(currentDonnee.id);
    }
  }

  private populatePreviousDonnee(id: number): void {
    this.backendApiService.getPreviousDonnee(id).subscribe(
      (previousDonnee: Donnee) => {
        this.previousDonnee = previousDonnee;
        console.log("La donnée précédente est", this.previousDonnee);
      },
      (error: any) => {
        console.error(
          "Impossible de trouver la donnée précédente (" + error + ")"
        );
      }
    );
  }

  public increaseIndexOfCurrentDonnee(afterDelete: boolean = false): void {
    // Donnee to display
    if (this.isLastDonneeCurrentlyDisplayed()) {
      // Last donnee
      this.currentDonneeIndex = null;
    } else if (!afterDelete) {
      this.currentDonneeIndex++;
    }
  }

  public updateNextDonnee(currentDonnee: Donnee): void {
    // Next donnee
    this.nextDonnee = null;
    if (this.currentDonneeIndex != null) {
      this.populateNextDonnee(currentDonnee.id);
    }
  }

  public populateNextDonnee(id: number): void {
    if (!this.isLastDonneeCurrentlyDisplayed()) {
      this.backendApiService.getNextDonnee(id).subscribe(
        (nextDonnee: Donnee) => {
          this.nextDonnee = nextDonnee;
        },
        (error: any) => {
          console.error(
            "Impossible de trouver la donnée suivante (" + error + ")"
          );
        }
      );
    }
  }

  public getNextInventaire(): Inventaire {
    let nextInventaire: Inventaire;

    if (this.isLastDonneeCurrentlyDisplayed()) {
      // Last donnee
      nextInventaire = this.savedInventaire;
    } else {
      nextInventaire = this.nextDonnee.inventaire;
    }

    return nextInventaire;
  }

  public getNextMode(): CreationModeEnum {
    let nextMode: CreationModeEnum;

    if (this.isLastDonneeCurrentlyDisplayed()) {
      // Last donnee
      nextMode = this.savedMode;
    } else {
      nextMode = CreationModeEnum.UPDATE;
    }

    return nextMode;
  }

  public getNextDonnee(): Donnee {
    let nextDonnee: Donnee;

    if (this.isLastDonneeCurrentlyDisplayed()) {
      // Last donnee
      nextDonnee = this.savedDonnee;
    } else {
      nextDonnee = this.nextDonnee;
    }

    return nextDonnee;
  }

  private isLastDonneeCurrentlyDisplayed() {
    return this.numberOfDonnees === this.currentDonneeIndex;
  }

  public hasPreviousDonnee(): boolean {
    return !!this.previousDonnee;
  }

  public hasNextDonnee(): boolean {
    return !!this.nextDonnee;
  }

  public saveInventaireToBeUpdated(inventaire: Inventaire) {
    this.inventaireToBeUpdated = {
      observateur: inventaire.observateur,
      date: inventaire.date,
      heure: inventaire.heure,
      duree: inventaire.duree,
      lieudit: inventaire.lieudit,
      altitude: inventaire.altitude,
      longitude: inventaire.longitude,
      latitude: inventaire.latitude,
      temperature: inventaire.temperature,
      meteos: inventaire.meteos
    } as Inventaire;
  }

  public isInventaireUpdated(inventaire: Inventaire) {
    if (inventaire.observateur !== this.inventaireToBeUpdated.observateur) {
      return true;
    }

    // TODO continue

    return false;
  }
}
