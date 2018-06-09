import { Injectable } from "@angular/core";
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

    constructor(public creationService: CreationService, public modeHelper: CreationModeHelper) {
    }

    public init(lastDonnee: Donnee, numberOfDonnees: number): void {
        this.previousDonnee = lastDonnee;
        this.nextDonnee = null;
        this.currentDonneeIndex = null;
        this.numberOfDonnees = numberOfDonnees;
        this.savedDonnee = new Donnee();
        this.savedInventaire = new Inventaire();
        this.savedMode = null;
    }
    public saveCurrentContext(modeToSave: CreationMode, inventaireToSave: Inventaire, donneeToSave: Donnee): void {
        this.savedDonnee = new Donnee();
        this.savedInventaire = new Inventaire();

        this.savedMode = modeToSave;

        if (this.modeHelper.isInventaireMode(this.savedMode)) {
            this.savedInventaire = inventaireToSave;
        }

        if (this.modeHelper.isDonneeMode(this.savedMode)) {
            this.savedDonnee = donneeToSave;
            this.savedInventaire = donneeToSave.inventaire;
        }

        console.log("Sauvegarde de l'inventaire courant:", this.savedInventaire);
        console.log("Sauvegarde de la donnée courante", this.savedDonnee);
    }

    public updateCurrentDonneeIndexWithPreviousDonnee(): void {
        if (!!!this.currentDonneeIndex) {
            this.currentDonneeIndex = this.numberOfDonnees;
        } else {
            this.currentDonneeIndex--;
        }
    }

    public setNextDonnee(donnee: Donnee) {
        this.nextDonnee = donnee;
        console.log("La donnée suivante est", donnee);
    }

    public updatePreviousDonnee(currentDonnee: Donnee): void {
        const hasPreviousDonnee: boolean = this.currentDonneeIndex > 1;
        if (!hasPreviousDonnee) {
            this.previousDonnee = null;
        } else {
            this.populatePreviousDonnee(currentDonnee.id);
        }
        console.log("La donnée précédente est", this.previousDonnee);
    }

    private populatePreviousDonnee(id: number): void {
        this.creationService.getPreviousDonnee(id)
            .subscribe(
                (previousDonnee: Donnee) => {
                    this.previousDonnee = previousDonnee;
                },
                (error: any) => {
                    console.error("Impossible de trouver la donnée précédente (" + error + ")");
                });
    }

    public updateCurrentDonneeIndexWithNextDonnee(afterDelete: boolean = false): void {
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
        if (this.currentDonneeIndex == null) {
            this.nextDonnee = null;
        } else {
            this.populateNextDonnee(currentDonnee.id);
        }
    }

    public populateNextDonnee(id: number): void {
        if (!this.isLastDonneeCurrentlyDisplayed()) {
            this.creationService.getNextDonnee(id)
                .subscribe(
                    (nextDonnee: Donnee) => {
                        this.nextDonnee = nextDonnee;
                    },
                    (error: any) => {
                        console.error("Impossible de trouver la donnée suivante (" + error + ")");
                    });
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
}
