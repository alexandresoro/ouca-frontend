import { Injectable } from "@angular/core";
import { Subscription } from "../../../../node_modules/rxjs";
import { Donnee } from "../../model/donnee.object";
import { Inventaire } from "../../model/inventaire.object";
import { CreationMode, CreationModeHelper } from "./creation-mode.enum";
import { CreationService } from "./creation.service";

@Injectable()
export class NavigationService {
  public previousDonnee: Donnee;
  public nextDonnee: Donnee;
  public currentDonneeIndex: number;

  public numberOfDonnees: number;

  public savedDonnee: Donnee;
  public savedInventaire: Inventaire;
  public savedMode: CreationMode;

  private inventaireToBeUpdated: Inventaire;

  constructor(
    public creationService: CreationService,
    public modeHelper: CreationModeHelper
  ) {}

  public init(lastDonnee: Donnee, numberOfDonnees: number): void {
    this.previousDonnee = lastDonnee;
    this.nextDonnee = null;
    this.currentDonneeIndex = null;
    this.numberOfDonnees = numberOfDonnees;
    this.savedDonnee = new Donnee();
    this.savedInventaire = new Inventaire();
    this.savedMode = null;
  }
  public saveCurrentContext(
    modeToSave: CreationMode,
    inventaireToSave: Inventaire,
    donneeToSave: Donnee
  ): void {
    this.savedDonnee = new Donnee();
    this.savedInventaire = new Inventaire();

    this.savedMode = modeToSave;

    if (this.modeHelper.isInventaireMode(this.savedMode)) {
      this.savedDonnee.inventaire = inventaireToSave;
    }

    if (this.modeHelper.isDonneeMode(this.savedMode)) {
      this.savedDonnee = donneeToSave;
    }

    console.log("Sauvegarde de la donnée courante", this.savedDonnee);
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
        this.creationService.getPreviousDonnee(newCurrentDonnee.id).subscribe(
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
        this.creationService.getNextDonnee(newCurrentDonnee.id).subscribe(
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
    this.creationService.getPreviousDonnee(id).subscribe(
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
      this.creationService.getNextDonnee(id).subscribe(
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

  public getNextMode(): CreationMode {
    let nextMode: CreationMode;

    if (this.isLastDonneeCurrentlyDisplayed()) {
      // Last donnee
      nextMode = this.savedMode;
    } else {
      nextMode = CreationMode.UPDATE;
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
    this.inventaireToBeUpdated = new Inventaire();
    this.inventaireToBeUpdated.observateur = inventaire.observateur;
    this.inventaireToBeUpdated.date = inventaire.date;
    this.inventaireToBeUpdated.heure = inventaire.heure;
    this.inventaireToBeUpdated.duree = inventaire.duree;
    this.inventaireToBeUpdated.lieudit = inventaire.lieudit;
    this.inventaireToBeUpdated.altitude = inventaire.altitude;
    this.inventaireToBeUpdated.longitude = inventaire.longitude;
    this.inventaireToBeUpdated.latitude = inventaire.latitude;
    this.inventaireToBeUpdated.temperature = inventaire.temperature;
    this.inventaireToBeUpdated.meteos = inventaire.meteos;
  }

  public isInventaireUpdated(inventaire: Inventaire) {
    if (inventaire.observateur !== this.inventaireToBeUpdated.observateur) {
      return true;
    }

    // TODO continue

    return false;
  }
}
