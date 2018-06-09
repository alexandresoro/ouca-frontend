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
import { NavigationService } from "./navigation.service";

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

    constructor(public modeHelper: CreationModeHelper,
                private creationService: CreationService,
                private donneeService: DonneeService,
                private inventaireService: InventaireService,
                private http: Http,
                public navigationService: NavigationService) {
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
                (error: any) => {
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
        this.navigationService.init(this.pageModel.lastDonnee, this.pageModel.numberOfDonnees);

        this.switchToNewInventaireMode();

        console.log("Le modèle initial de la page de création est", this.pageModel);
    }

    private onInitCreationPageError(error: any): void {
        this.setErrorMessage("Impossible de charger la page de création.\nErreur: " + error);
        console.error("Impossible de récupérer le modèle pour la page de création.\n Détails de l'erreur: "
            + error + ")");
    }

    /**
     * When creating a new inventaire, initialize the form
     * Set observateur to the default observateur...
     */
    private initInventaireDefaultValues(): void {
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

    /**
     * When creating a new donne, initialize the form
     */
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

        this.selectedComportements = [];
        this.selectedMilieux = [];
    }

    /**
     * When selecting a departement, filter the list of communes, set back the lieu-dit to empty lieu-dit
     */
    private updateCommunes(): void {
        if (!!this.selectedDepartement && !!this.selectedDepartement.id) {
            this.filteredCommunes = this.pageModel.communes.filter(
                (commune) => commune.departement.id === this.selectedDepartement.id,
            );
            this.filteredLieuxdits = new Array<Lieudit>();
            this.initCoordinates();
        }
    }

    /**
     * When selecting a commune, filter the list of lieux-dits
     */
    private updateLieuxdits(): void {
        if (!!this.selectedCommune && !!this.selectedCommune.id) {
            this.filteredLieuxdits = this.pageModel.lieudits.filter(
                (lieudit) => lieudit.commune.id === this.selectedCommune.id,
            );
            this.initCoordinates();
        }
    }

    /**
     * When selecting a classe, filter the list of especes
     */
    public updateEspeces(): void {
        if (!!this.selectedClasse && !!this.selectedClasse.id) {
            this.filteredEspeces = this.pageModel.especes.filter(
                (espece) => espece.classe.id === this.selectedClasse.id,
            );
        } else {
            // If "Toutes" we display all the especes
            this.filteredEspeces = this.pageModel.especes;
        }
    }

    /**
     * Called when selecting a lieu-dit in the dropdown
     */
    private updateCoordinates(): void {
        this.inventaireToSave.altitude = this.inventaireToSave.lieudit.altitude;
        this.inventaireToSave.longitude = this.inventaireToSave.lieudit.longitude;
        this.inventaireToSave.latitude = this.inventaireToSave.lieudit.latitude;
    }

    /**
     * Re-initialize the coordinates to empty
     */
    private initCoordinates(): void {
        this.inventaireToSave.altitude = null;
        this.inventaireToSave.longitude = null;
        this.inventaireToSave.latitude = null;
    }

    /**
     * Called when a donnee is saved
     */
    private updateNextRegroupement(): void {
        this.creationService.getNextRegroupement()
            .subscribe(
                (regroupement: number) => {
                    this.nextRegroupement = regroupement;
                },
                (error: any) => {
                    console.error("Impossible de trouver le prochain regroupement (" + error + ")");
                });
    }

    /**
     * Called when clicking on Regroupement button
     */
    public displayNextRegroupement(): void {
        this.donneeToSave.regroupement = this.nextRegroupement;
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
                (error: any) => {
                    this.onSaveInventaireError(error);
                });
    }

    private onSaveInventaireSuccess() {
        if (this.inventaireToSave.altitude == null) {
            this.updateCoordinates();
        }

        this.donneeToSave = new Donnee();
        this.donneeToSave.inventaire = this.inventaireToSave;

        this.switchToNewDonneeMode();
    }
    private onSaveInventaireError(error: any) {
        this.setErrorMessage("L'inventaire n'a pas pu êtr créé/modifié.");
        console.error("Impossible de créer l'inventaire.\nDétails de l'erreur:" + error);
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
                        this.onSaveDonneeSuccess(result.object);
                    }
                },
                (error: any) => {
                    this.onSaveDonneeError(error);
                });
    }

    private onSaveDonneeSuccess(savedDonnee: Donnee) {
        this.donneeToSave = new Donnee();
        this.donneeToSave.inventaire = this.inventaireToSave;
        this.navigationService.numberOfDonnees++;
        this.navigationService.previousDonnee = savedDonnee;
        this.initializeDonneePanel();
        this.updateNextRegroupement();
    }

    private onSaveDonneeError(error: any) {
        this.setErrorMessage("La donnée n'a pas pu être créée ou modifiée.");
        console.error("Impossible de créer la donnée.\nDétails de l'erreur:" + error);
    }

    private initializeDonneePanel(): void {
        this.selectedClasse = null; // TODO toutes or null?
        this.updateEspeces();
        this.initDonneeDefaultValues();
    }

    /**
     * Update
     */
    public saveInventaireAndDonnee(): void {
        // TODO
    }

    /**
     * Called when clicking on "Donnee precedente" button
     */
    public onPreviousDonneeBtnClicked(): void {
        // Save the current donnee or inventaire and mode
        if (!this.modeHelper.isUpdateMode(this.mode)) {
            this.navigationService.saveCurrentContext(this.mode, this.inventaireToSave, this.donneeToSave);
            this.switchToUpdateMode();
        }

        // Set next donnee with current donnee
        this.navigationService.setNextDonnee(this.donneeToSave);

        // Set current donnee with previous donnee
        this.inventaireToSave = this.navigationService.previousDonnee.inventaire;
        this.donneeToSave = this.navigationService.previousDonnee;
        this.navigationService.updateCurrentDonneeIndexWithPreviousDonnee();
        console.log("La donnée courante est", this.inventaireToSave, this.donneeToSave);
        console.log("Index de la donnée courante", this.navigationService.currentDonneeIndex);

        // Set new previous donnee
        this.navigationService.updatePreviousDonnee(this.donneeToSave);
        console.log("La donnée courante est 1", this.inventaireToSave, this.donneeToSave);
    }

    public onNextDonneeBtnClicked(): void {
        this.setPreviousDonneeToTheCurrentDonnee();
        this.setCurrentDonneeToTheNextDonnee();
        this.setNewNextDonnee();
    }

    private setPreviousDonneeToTheCurrentDonnee(): void {
        this.navigationService.previousDonnee = this.donneeToSave;
    }

    private setCurrentDonneeToTheNextDonnee(afterDelete: boolean = false): void {
        this.mode = this.navigationService.getNextMode();
        if (this.modeHelper.isInventaireMode(this.mode)) {
            this.switchToNewInventaireMode();
        } else if (this.modeHelper.isDonneeMode(this.mode)) {
            this.switchToNewDonneeMode();
        }

        this.inventaireToSave = this.navigationService.getNextInventaire();
        this.donneeToSave = this.navigationService.getNextDonnee();

        this.navigationService.updateCurrentDonneeIndexWithNextDonnee(afterDelete);

        console.log("Mode et inventaire et donnée courants:", this.mode.toString(),
            this.inventaireToSave, this.donneeToSave);
        console.log("Index de la donnée courante", this.navigationService.currentDonneeIndex);
    }

    private setNewNextDonnee() {
        this.navigationService.updateNextDonnee(this.donneeToSave);
    }
    public deleteDonnee(donnee: Donnee): void {
        this.creationService.deleteDonnee(donnee.id)
            .subscribe(
                (result: EntiteResult<Donnee>) => {
                    this.onDeleteSuccess(result);
                },
                (error: any) => {
                    this.onDeleteError(error);
                });
    }

    private onDeleteSuccess(result: EntiteResult<Donnee>): void {
        this.status = result.status;
        this.messages = result.messages;

        if (this.isSuccess()) {
            this.setCurrentDonneeToTheNextDonnee(true);
            this.navigationService.numberOfDonnees--;
            this.setNewNextDonnee();

            // TODO remove the donnee from the list of donnee
            // let index = this._objects.indexOf(object);
            // if (index > -1) {
            //     this._objects.splice(index, 1);
            // }
            // this.switchToViewAllMode();
        }
    }

    private onDeleteError(error: any): void {
        console.error("Echec lors de la suppression de la donnée (" + error + ")");
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
        return false; // TODO
    }

    public isDeleteDonneeBtnDisplayed(): boolean {
        return this.modeHelper.isUpdateMode(this.mode);
    }

    public isPreviousDonneeBtnDisplayed(): boolean {
        return this.navigationService.hasPreviousDonnee();
    }

    public isNextDonneeBtnDisplayed(): boolean {
        return this.modeHelper.isUpdateMode(this.mode);
    }

    public onBackToCreationDonneeBtnClicked(): void {
        // TODO
        this.redisplayCurrentInventaireAndDonnee();
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

    private redisplayCurrentInventaireAndDonnee(): void {
        this.mode = this.navigationService.savedMode;
        if (this.modeHelper.isInventaireMode(this.mode)) {
            this.switchToNewInventaireMode();
            this.inventaireToSave = this.navigationService.savedInventaire;
            this.donneeToSave = new Donnee();
        } else if (this.modeHelper.isDonneeMode(this.mode)) {
            this.switchToNewDonneeMode();
            this.inventaireToSave = this.navigationService.savedInventaire;
            this.donneeToSave = this.navigationService.savedDonnee;
        }
    }

    private switchToNewInventaireMode(): void {
        this.mode = CreationMode.NEW_INVENTAIRE;
        this.isDonneeDisabled = true;
        this.isInventaireDisabled = false;
        this.inventaireToSave = new Inventaire();
        this.donneeToSave = new Donnee();
        this.initInventaireDefaultValues();

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

    private isSuccess(): boolean {
        return this.status === "SUCCESS";
    }

    private setErrorMessage(message: string): void {
        this.status = this.STATUS_ERROR;
        this.messages = [{ value: message }];
    }
}
