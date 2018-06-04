import { Component, OnInit } from "@angular/core";
import { Http } from "@angular/http";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import { Classe } from "../../model/classe.object";
import { Commune } from "../../model/commune.object";
import { Comportement } from "../../model/comportement.object";
import { CreationPage } from "../../model/creation-page.object";
import { Departement } from "../../model/departement.object";
import { Donnee } from "../../model/donnee.object";
import { Lieudit } from "../../model/lieudit.object";
import { Observateur } from "../../model/observateur.object";
import { EntiteResult } from "./../../model/entite-result.object";
import { Espece } from "./../../model/espece.object";
import { EstimationNombre } from "./../../model/estimation-nombre.object";
import { Inventaire } from "./../../model/inventaire.object";
import { CreationMode, CreationModeHelper } from "./creation-mode.enum";
import { CreationService } from "./creation.service";
import { DonneeService } from "./donnee.service";
import { InputCodeLibelleEventObject } from "./input-code-libelle/input-code-libelle-event.object";
import { InventaireService } from "./inventaire.service";

@Component({
    templateUrl: "./creation.tpl.html",
})
export class CreationComponent implements OnInit {

    private STATUS_ERROR: string = "ERROR";
    private STATUS_SUCCESS: string = "SUCCESS";

    // Page model returned from back-end
    public pageModel: CreationPage = {} as CreationPage;

    // Inventaire, Donnee, UPDATE
    public mode: CreationMode;

    public isDonneeDisabled: boolean;
    public isInventaireDisabled: boolean;

    public inventaireToSave: Inventaire = new Inventaire();
    public donneeToSave: Donnee = new Donnee();

    private savedDonnee: Donnee;
    private savedInventaire: Inventaire;
    private savedMode: CreationMode;

    public dateInventaire: string;
    public selectedDepartement: Departement;
    public selectedCommune: Commune;
    public selectedAltitude: number;
    public selectedLongitude: number;
    public selectedLatitude: number;
    public selectedClasse: Classe;
    public selectedComportements: Comportement[] = new Array<Comportement>(6);
    public selectedMilieux: Comportement[] = new Array<Comportement>(6);
    public nextRegroupement: number;

    public filteredCommunes: Commune[];
    public filteredLieuxdits: Lieudit[];
    public filteredEspeces: Espece[];

    private messages: any[];
    private status: string;

    private previousDonnee: Donnee;
    private nextDonnee: Donnee;
    private numberOfDonnees: number;
    private currentDonneeIndex: number;

    constructor(public modeHelper: CreationModeHelper,
                private creationService: CreationService,
                private donneeService: DonneeService,
                private inventaireService: InventaireService,
                private http: Http) {
    }

    public ngOnInit(): void {
        this.initCreationPage();
    }

    /**
     * Called when launching the page
     * Call the back-end to get the initial creation page model
     */
    private initCreationPage(): void {
        this.creationService.getInitialPageModel()
            .subscribe(
                (creationPage: CreationPage) => {
                    this.onInitCreationPageSucces(creationPage);
                },
                (error) => {
                    this.onInitCreationPageError(error);
                });
    }

    /**
     * If back-end call is successful, use the initial creation page model to build the page
     * @param creationPage: CreationPage
     */
    private onInitCreationPageSucces(creationPage: CreationPage): void {
        this.pageModel = creationPage;
        this.nextRegroupement = this.pageModel.nextRegroupement;
        console.log("Le modèle initial de la page de création est", this.pageModel);
        this.switchToNewInventaireMode();
    }
    private onInitCreationPageError(error: any): void {
        this.status = this.STATUS_ERROR;
        this.messages = [{ value: "toto" + error }];
        console.error("Impossible de récupérer le modèle pour la page de création.\n Détails de l'erreur: "
            + error + ")");
    }
    private initDefaultValues(): void {
        if (!!this.pageModel.defaultObservateur && !!this.pageModel.defaultObservateur.id) {
            this.inventaireToSave.observateur = this.pageModel.observateurs.find(
                (observateur) => observateur.id === this.pageModel.defaultObservateur.id,
            );
        }
        this.inventaireToSave.associes = new Array<Observateur>();

        this.dateInventaire = new Date().toISOString().substring(0, 10);
        this.inventaireToSave.duree = null;
        this.inventaireToSave.heure = null;

        if (!!this.pageModel.defaultDepartement && !!this.pageModel.defaultDepartement.id) {
            this.selectedDepartement = this.pageModel.departements.find(
                (departement) => departement.id === this.pageModel.defaultDepartement.id,
            );
        }

        this.updateCommunes();
        this.filteredLieuxdits = new Array<Lieudit>();
        this.initCoordinates();
    }

    private initDonneeDefaultValues(): void {
        // Especes
        this.filteredEspeces = this.pageModel.especes;

        // Nombre
        this.donneeToSave.nombre = this.pageModel.defaultNombre;
        if (!!this.pageModel.defaultEstimationNombre && !!this.pageModel.defaultEstimationNombre.id) {
            this.donneeToSave.estimationNombre = this.pageModel.estimationsNombre.find(
                (estimation) => estimation.id === this.pageModel.defaultEstimationNombre.id,
            );

            if (this.pageModel.defaultEstimationNombre.nonCompte) {
                this.donneeToSave.nombre = null;
            }
        }

        // Sexe
        if (!!this.pageModel.defaultSexe && !!this.pageModel.defaultSexe.id) {
            this.donneeToSave.sexe = this.pageModel.sexes.find(
                (sexe) => sexe.id === this.pageModel.defaultSexe.id,
            );
        }

        // Age
        if (!!this.pageModel.defaultAge && !!this.pageModel.defaultAge.id) {
            this.donneeToSave.age = this.pageModel.ages.find(
                (age) => age.id === this.pageModel.defaultAge.id,
            );
        }

        // TODO milieux ?
        this.selectedComportements = [];
        this.selectedMilieux = [];
    }

    private updateCommunes(): void {
        if (!!this.selectedDepartement && !!this.selectedDepartement.id) {
            this.filteredCommunes = this.pageModel.communes.filter(
                (commune) => commune.departement.id === this.selectedDepartement.id,
            );
            this.filteredLieuxdits = new Array<Lieudit>();
            this.initCoordinates();
        }
    }

    private updateLieuxdits(): void {
        //  if (!!this.selectedCommune && !!this.selectedCommune.id) {
        this.filteredLieuxdits = this.pageModel.lieudits.filter(
            (lieudit) => lieudit.commune.id === this.selectedCommune.id,
        );
        this.initCoordinates();
        // }
    }

    private updateCoordinates(): void {
        this.inventaireToSave.altitude = this.inventaireToSave.lieudit.altitude;
        this.inventaireToSave.longitude = this.inventaireToSave.lieudit.longitude;
        this.inventaireToSave.latitude = this.inventaireToSave.lieudit.latitude;
    }

    private initCoordinates(): void {
        this.inventaireToSave.altitude = null;
        this.inventaireToSave.longitude = null;
        this.inventaireToSave.latitude = null;
    }

    private updateNextRegroupement(): void {
        this.creationService.getNextRegroupement()
            .subscribe(
                (regroupement: number) => {
                    this.nextRegroupement = regroupement;
                },
                (error) => {
                    console.error("Impossible de trouver le prochain regroupement (" + error + ")");
                });
    }

    /**
     * To be called when clicking on Regroupement button
     */
    public displayNextRegroupement(): void {
        this.donneeToSave.regroupement = this.nextRegroupement;
    }

    public updateEspeces(): void {
        if (!!this.selectedClasse && !!this.selectedClasse.id) {
            this.filteredEspeces = this.pageModel.especes.filter(
                (espece) => espece.classe.id === this.selectedClasse.id,
            );
        } else {
            this.filteredEspeces = this.pageModel.especes;
        }
    }

    /**
     * Called when clicking on Save Inventaire button
     */
    public saveInventaire(): void {
        // Prepare inventaire
        this.inventaireToSave.date = new Date(this.dateInventaire);

        console.log("Inventaire to save is", this.inventaireToSave);

        this.inventaireService.saveObject(this.inventaireToSave)
            .subscribe(
                (result: EntiteResult<Inventaire>) => {
                    this.status = result.status;
                    this.messages = result.messages;
                    this.inventaireToSave = result.object;

                    if (this.isSuccess()) {
                        this.onSaveInventaireSuccess();
                    }
                },
                (error) => {
                    this.onSaveInventaireError(error);
                });
    }

    private isSuccess(): boolean {
        return this.status === "SUCCESS";
    }
    private onSaveInventaireSuccess() {
        this.donneeToSave = new Donnee();
        this.donneeToSave.inventaire = this.inventaireToSave;
        this.switchToNewDonneeMode();
    }
    private onSaveInventaireError(error: any) {
        this.status = "ERROR";
        this.messages = ["L'inventaire n'a pas pu êtr créé/modifié."];
        console.error("Impossible de créer l'inventaire (" + error + ")");
    }

    /**
     * Called when clicking on Save Donnee button
     */
    public saveDonnee(): void {
        // Comportements
        for (const comportement of this.selectedComportements) {
            if (!!comportement && !!comportement.id) {
                this.donneeToSave.comportements.push(comportement);
            }
        }

        // Milieux
        for (const milieu of this.selectedMilieux) {
            if (!!milieu && !!milieu.id) {
                this.donneeToSave.milieux.push(milieu);
            }
        }

        console.log("Donnée to save is", this.donneeToSave);

        this.donneeService.saveObject(this.donneeToSave)
            .subscribe(
                (result: EntiteResult<Donnee>) => {
                    this.status = result.status;
                    this.messages = result.messages;
                    this.donneeToSave = result.object;
                    if (this.isSuccess()) {
                        this.onSaveDonneeSuccess();
                    }
                },
                (error) => {
                    this.onSaveDonneeError(error);
                });
    }

    private onSaveDonneeSuccess() {
        this.donneeToSave = new Donnee();
        this.donneeToSave.inventaire = this.inventaireToSave;
        this.initializeDonneePanel();
        this.updateNextRegroupement();
    }

    private onSaveDonneeError(error: any) {
        this.status = "ERROR";
        console.error("Impossible de créer la donnée (" + error + ")");
    }

    private initializeDonneePanel(): void {
        this.selectedClasse = null;
        this.updateEspeces();
        this.initDonneeDefaultValues();
    }

    /**
     * Update
     */
    public saveInventaireAndDonnee(): void {
        // TODO
    }

    private displayPreviousDonnee(): void {
        // If we were in creation mode we switch to update mode
        if (!this.modeHelper.isUpdateMode(this.mode)) {
            this.switchToUpdateMode();
        }

        // Next donnee TODO wont work if creation
        this.nextDonnee = this.donneeToSave;

        // Donnee to display
        this.inventaireToSave = this.previousDonnee.inventaire;
        this.donneeToSave = this.previousDonnee;
        if (!this.currentDonneeIndex) {
            this.currentDonneeIndex = this.numberOfDonnees;
        } else {
            this.currentDonneeIndex--;
        }

        // Previous donnee
        const hasPreviousDonnee: boolean = this.currentDonneeIndex > 1;
        if (!hasPreviousDonnee) {
            this.previousDonnee = null;
        } else {
            this.populatePreviousDonnee(this.donneeToSave.id);
        }
    }

    private displayNextDonnee(): void {
        // Previous donnee
        this.previousDonnee = this.donneeToSave;

        // Donnee to display
        let isLastDonnee: boolean = this.numberOfDonnees === this.currentDonneeIndex;
        if (isLastDonnee) {
            // Last donnee
            this.currentDonneeIndex = null;
            this.donneeToSave = this.savedDonnee;
            this.inventaireToSave = this.savedInventaire;
            if (!!this.donneeToSave && !!this.donneeToSave.inventaire && !!this.donneeToSave.inventaire.id) {
                this.switchToNewDonneeMode();
            } else {
                this.switchToNewInventaireMode();
            }
        } else {
            this.currentDonneeIndex++;
            this.donneeToSave = this.nextDonnee;
        }

        // Next donnee
        isLastDonnee = isLastDonnee || (this.numberOfDonnees === this.currentDonneeIndex);
        if (isLastDonnee) {
            this.nextDonnee = null;
        } else {
            this.populateNextDonnee(this.donneeToSave.id);
        }
    }

    private populateNextDonnee(id: number): void {
        this.creationService.getNextDonnee(id)
            .subscribe(
                (nextDonnee: Donnee) => {
                    this.nextDonnee = nextDonnee;
                },
                (error) => {
                    console.error("Impossible de trouver la donnée suivante (" + error + ")");
                });
    }

    private populatePreviousDonnee(id: number): void {
        this.creationService.getPreviousDonnee(id)
            .subscribe(
                (previousDonnee: Donnee) => {
                    this.previousDonnee = previousDonnee;
                },
                (error) => {
                    console.error("Impossible de trouver la donnée précédente (" + error + ")");
                });
    }

    public createNewDonnee(): void {
        this.redisplayCurrentInventaireAndDonnee();
    }

    public deleteDonnee(donnee: Donnee): void {
        this.creationService.deleteDonnee(donnee.id)
            .subscribe(
                (result: EntiteResult<Donnee>) => {
                    this.status = result.status;
                    if (this.status === "SUCCESS") {
                        // Display next donnee
                        if (this.currentDonneeIndex === this.numberOfDonnees) {
                            this.inventaireToSave = this.savedInventaire;
                            this.donneeToSave = this.savedDonnee;
                            this.currentDonneeIndex = null;
                            this.nextDonnee = null;

                            if (!!this.donneeToSave
                                && !!this.donneeToSave.inventaire
                                && !!this.donneeToSave.inventaire.id) {
                                this.switchToNewDonneeMode();
                            } else {
                                this.switchToNewInventaireMode();
                            }
                        } else {
                            this.donneeToSave = this.nextDonnee;
                            if (this.currentDonneeIndex === (this.numberOfDonnees - 1)) {
                                this.nextDonnee = null;
                            } else {
                                this.populateNextDonnee(this.donneeToSave.id);
                            }
                        }
                        this.numberOfDonnees--;

                        // let index = this._objects.indexOf(object);
                        // if (index > -1) {
                        //     this._objects.splice(index, 1);
                        // }
                        // this.switchToViewAllMode();
                    }
                    // this._messages = result["messages"];
                },
                (error) => {
                    console.error("Echec lors de la suppression de la donnée (" + error + ")");
                });
    }

    public onEstimationNombreChanged(estimation: EstimationNombre) {
        if (estimation.nonCompte) {
            this.donneeToSave.nombre = null;
        } else if (!this.donneeToSave.nombre) {
            // Set default value
            this.donneeToSave.nombre = this.pageModel.defaultNombre;
        }
    }

    public isComportementDisabled(index: number): boolean {
        return this.isDonneeDisabled
            || !this.selectedComportements[index - 2]
            || !this.selectedComportements[index - 2].id;
    }

    public isMilieuDisabled(index: number): boolean {
        return this.isDonneeDisabled
            || !this.selectedMilieux[index - 2]
            || !this.selectedComportements[index - 2].id;
    }

    public addComportement(event: InputCodeLibelleEventObject): void {
        this.selectedComportements[event.index - 1] = event.value;
    }

    public addMilieu(event: InputCodeLibelleEventObject): void {
        this.selectedMilieux[event.index - 1] = event.value;
    }

    public isNewDonneeBtnDisplayed(): boolean {
        return true; // TODO
    }

    public isDeleteDonneeBtnDisplayed(): boolean {
        return this.modeHelper.isUpdateMode(this.mode);
    }

    public isPreviousDonneeBtnDisplayed(): boolean {
        return !this.currentDonneeIndex || this.currentDonneeIndex > 1;
    }

    public isNextDonneeBtnDisplayed(): boolean {
        return this.modeHelper.isUpdateMode(this.mode);
    }

    public onNewDonneeBtnClicked(): void {
        // TODO
        this.switchToNewInventaireMode();
    }

    public onDeleteDonneeBtnClicked(): void {
        // TODO
        // Ask confirmation
        this.deleteDonnee(this.donneeToSave);

    }

    public onDeleteConfirmButtonClicked(): void {
        // TODO delete the donnee  and redisplay ?
    }

    public onDeleteCancelButtonClicked(): void {
        // TODO
    }

    public onPreviousDonneeBtnClicked(): void {
        // Save the current donnee or inventaire
        this.saveCurrentInventaireAndDonnee();

        // Display previous donnee
        this.displayPreviousDonnee();
    }

    public onNextDonneeBtnClicked(): void {
        // Display previous donnee
        this.displayNextDonnee();
    }

    private saveCurrentInventaireAndDonnee(): void {
        if (!this.modeHelper.isUpdateMode(this.mode)) {
            this.savedDonnee = null;
            this.savedInventaire = null;
            this.savedMode = this.mode;

            if (this.modeHelper.isInventaireMode(this.savedMode)) {
                this.savedInventaire = this.inventaireToSave;
            }

            if (this.modeHelper.isDonneeMode(this.savedMode)) {
                this.savedDonnee = this.donneeToSave;
                this.savedInventaire = this.donneeToSave.inventaire;
            }
        }
    }

    private redisplayCurrentInventaireAndDonnee(): void {
        if (this.modeHelper.isInventaireMode(this.savedMode)) {
            this.inventaireToSave = this.savedInventaire;
            this.donneeToSave = new Donnee();
            this.switchToNewInventaireMode();
        } else if (this.modeHelper.isDonneeMode(this.savedMode)) {
            this.inventaireToSave = this.savedInventaire;
            this.donneeToSave = this.savedDonnee;
            this.switchToNewDonneeMode();
        }
    }

    private switchToNewInventaireMode(): void {
        this.mode = CreationMode.NEW_INVENTAIRE;
        this.isDonneeDisabled = true;
        this.isInventaireDisabled = false;
        this.inventaireToSave = new Inventaire();
        this.donneeToSave = new Donnee();
        this.initDefaultValues();
        this.previousDonnee = this.pageModel.lastDonnee;
        this.nextDonnee = null;
        this.numberOfDonnees = this.pageModel.numberOfDonnees;
        this.currentDonneeIndex = null;
        document.getElementById("input-observateur").focus();
    }

    private switchToNewDonneeMode(): void {
        this.mode = CreationMode.NEW_DONNEE;
        this.isDonneeDisabled = false;
        this.isInventaireDisabled = true;
        this.initializeDonneePanel();
        document.getElementById("input-code-espece").focus();
    }

    private switchToUpdateMode(): void {
        this.mode = CreationMode.UPDATE;
        this.isDonneeDisabled = false;
        this.isInventaireDisabled = false;
        document.getElementById("input-observateur").focus();
    }

    public commentaireKeyPress(event: any) {
        const pattern = new RegExp(";");
        const inputChar = String.fromCharCode(event.charCode);
        if (pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
        }
    }
}
