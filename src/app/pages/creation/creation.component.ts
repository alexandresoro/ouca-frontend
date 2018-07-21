import { Component, OnInit } from "@angular/core";
import { MatDialog } from "../../../../node_modules/@angular/material";
import { ConfirmationDialogData } from "../../components/dialog/confirmation-dialog-data.object";
import { ConfirmationDialogComponent } from "../../components/dialog/confirmation-dialog.component";
import { SearchByIdDialogComponent } from "../../components/search-by-id-dialog/search-by-id-dialog.component";
import { Classe } from "../../model/classe.object";
import { Commune } from "../../model/commune.object";
import { Comportement } from "../../model/comportement.object";
import { CreationPage } from "../../model/creation-page.object";
import { Departement } from "../../model/departement.object";
import { Donnee } from "../../model/donnee.object";
import { EntiteResult } from "../../model/entite-result.object";
import { Espece } from "../../model/espece.object";
import { EstimationNombre } from "../../model/estimation-nombre.object";
import { Inventaire } from "../../model/inventaire.object";
import { Lieudit } from "../../model/lieudit.object";
import { Observateur } from "../../model/observateur.object";
import { PageComponent } from "../page.component";
import { CreationMode, CreationModeHelper } from "./creation-mode.enum";
import { CreationService } from "./creation.service";
import { DonneeService } from "./donnee.service";
import { InputCodeLibelleEventObject } from "./input-code-libelle/input-code-libelle-event.object";
import { InventaireService } from "./inventaire.service";
import { NavigationService } from "./navigation.service";

@Component({
  templateUrl: "./creation.tpl.html"
})
export class CreationComponent extends PageComponent implements OnInit {
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

  constructor(
    public modeHelper: CreationModeHelper,
    private creationService: CreationService,
    private donneeService: DonneeService,
    private inventaireService: InventaireService,
    public dialog: MatDialog,
    public navigationService: NavigationService
  ) {
    super();
  }

  public ngOnInit(): void {
    this.initCreationPage();
  }

  /**
   * Called when launching the page
   * Call the back-end to get the initial creation page model
   */
  private initCreationPage(): void {
    this.creationService.getInitialPageModel().subscribe(
      (creationPage: CreationPage) => {
        this.onInitCreationPageSucces(creationPage);
      },
      (error: any) => {
        this.onInitCreationPageError(error);
      }
    );
  }

  /**
   * If back-end call is successful, use the initial creation page model to build the page
   * @param creationPage: CreationPage
   */
  private onInitCreationPageSucces(creationPage: CreationPage): void {
    this.pageModel = creationPage;
    this.nextRegroupement = this.pageModel.nextRegroupement;
    this.navigationService.init(
      this.pageModel.lastDonnee,
      this.pageModel.numberOfDonnees
    );

    this.switchToNewInventaireMode();

    console.log("Le modèle initial de la page de création est", this.pageModel);
  }

  private onInitCreationPageError(error: any): void {
    this.setErrorMessage(
      "Impossible de charger la page de création.\nErreur: " + error
    );
    console.error(
      "Impossible de récupérer le modèle pour la page de création.\n Détails de l'erreur: " +
        error +
        ")"
    );
  }

  /**
   * When creating a new inventaire, initialize the form
   * Set observateur to the default observateur...
   */
  private initInventaireDefaultValues(): void {
    if (
      !!this.pageModel.defaultObservateur &&
      !!this.pageModel.defaultObservateur.id
    ) {
      this.inventaireToSave.observateur = this.pageModel.observateurs.find(
        (observateur) => observateur.id === this.pageModel.defaultObservateur.id
      );
    }

    this.inventaireToSave.associes = new Array<Observateur>();

    this.dateInventaire = new Date().toISOString().substring(0, 10);
    this.inventaireToSave.duree = null;
    this.inventaireToSave.heure = null;

    if (
      !!this.pageModel.defaultDepartement &&
      !!this.pageModel.defaultDepartement.id
    ) {
      this.selectedDepartement = this.pageModel.departements.find(
        (departement) => departement.id === this.pageModel.defaultDepartement.id
      );
    }
    this.selectedCommune = null;
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
    if (
      !!this.pageModel.defaultEstimationNombre &&
      !!this.pageModel.defaultEstimationNombre.id
    ) {
      this.donneeToSave.estimationNombre = this.pageModel.estimationsNombre.find(
        (estimation) =>
          estimation.id === this.pageModel.defaultEstimationNombre.id
      );

      if (this.pageModel.defaultEstimationNombre.nonCompte) {
        this.donneeToSave.nombre = null;
      }
    }

    // Sexe
    if (!!this.pageModel.defaultSexe && !!this.pageModel.defaultSexe.id) {
      this.donneeToSave.sexe = this.pageModel.sexes.find(
        (sexe) => sexe.id === this.pageModel.defaultSexe.id
      );
    }

    // Age
    if (!!this.pageModel.defaultAge && !!this.pageModel.defaultAge.id) {
      this.donneeToSave.age = this.pageModel.ages.find(
        (age) => age.id === this.pageModel.defaultAge.id
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
        (commune) => commune.departement.id === this.selectedDepartement.id
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
      // METHOD 1 The lieux-dits are returned by init of the page
      this.filteredLieuxdits = this.pageModel.lieudits.filter(
        (lieudit) => lieudit.commune.id === this.selectedCommune.id
      );

      // METHOD 2 We get the lieux-dits when selecting a commune
      // You should comment the line creationPage.setLieudits(lieuditService.findAll()); in CreationService.java
      /*
      this.creationService
        .getLieuxditsByCommuneId(this.selectedCommune.id)
        .subscribe(
          (lieuxdits: Lieudit[]) => {
            this.filteredLieuxdits = lieuxdits;
          },
          (error: any) => {
            console.error("error");
          }
        );
        */

      this.initCoordinates();
    }
  }

  /**
   * When selecting a classe, filter the list of especes
   */
  public updateEspeces(): void {
    if (!!this.selectedClasse && !!this.selectedClasse.id) {
      this.filteredEspeces = this.pageModel.especes.filter(
        (espece) => espece.classe.id === this.selectedClasse.id
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
    this.creationService.getNextRegroupement().subscribe(
      (regroupement: number) => {
        this.nextRegroupement = regroupement;
      },
      (error: any) => {
        console.error(
          "Impossible de trouver le prochain regroupement (" + error + ")"
        );
      }
    );
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

    this.inventaireService.saveInventaire(this.inventaireToSave).subscribe(
      (result: EntiteResult<Inventaire>) => {
        this.updatePageStatus(result.status, result.messages);
        this.inventaireToSave = result.object;

        if (this.isSuccess()) {
          this.onSaveInventaireSuccess();
        }
      },
      (error: any) => {
        this.onSaveInventaireError(error);
      }
    );
  }

  private onSaveInventaireSuccess() {
    if (this.inventaireToSave.altitude == null) {
      this.updateCoordinates();
    }

    // this.donneeToSave = new Donnee();
    this.donneeToSave.inventaire = this.inventaireToSave;

    this.switchToEditionDonneeMode();
  }
  private onSaveInventaireError(error: any) {
    this.setErrorMessage("L'inventaire n'a pas pu êtr créé/modifié.");
    console.error(
      "Impossible de créer l'inventaire.\nDétails de l'erreur:" + error
    );
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

    this.donneeService.saveDonnee(this.donneeToSave).subscribe(
      (result: EntiteResult<Donnee>) => {
        this.updatePageStatus(result.status, result.messages);
        this.donneeToSave = result.object;
        if (this.isSuccess()) {
          this.onSaveDonneeSuccess(result.object);
        }
      },
      (error: any) => {
        this.onSaveDonneeError(error);
      }
    );
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
    console.error(
      "Impossible de créer la donnée.\nDétails de l'erreur:" + error
    );
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
    const isInventaireUpdated: boolean = true; // TODO

    if (!!isInventaireUpdated) {
      this.displayInventaireDialog();
    }
  }

  private displayInventaireDialog(): void {
    const updateInventaireDialogData = new ConfirmationDialogData(
      "Confirmation de mise-à-jour",
      "Voulez-vous mettre à jour la fiche inventaire pour cette fiche espèce " +
        "seulement ou pour toutes les fiches espèces avec cette fiche inventaire ?",
      "Pour toutes les fiches espèces de cette fiche inventaire",
      "Pour cette fiche espèce seulement"
    );
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: "700px",
      data: updateInventaireDialogData
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!!result) {
        // We just update the inventaire
        this.updateInventaireAndDonnee(false);
      } else {
        // We create a new inventaire for this donnee
        this.updateInventaireAndDonnee(true);
      }
    });
  }

  /**
   * Called when clicking on "Donnee precedente" button
   */
  public onPreviousDonneeBtnClicked(): void {
    // Save the current donnee or inventaire and mode
    if (!this.modeHelper.isUpdateMode(this.mode)) {
      this.navigationService.saveCurrentContext(
        this.mode,
        this.inventaireToSave,
        this.donneeToSave
      );
      this.switchToUpdateMode();
    }

    let newNextDonnee = this.donneeToSave;
    if (!!!this.navigationService.currentDonneeIndex) {
      // We are displaying the creation form so the next donnee is the saved donnee
      newNextDonnee = this.navigationService.savedDonnee;
    }

    // Set the current donnee to display
    this.donneeToSave = this.navigationService.previousDonnee;
    this.inventaireToSave = this.donneeToSave.inventaire;
    this.navigationService.decreaseIndexOfCurrentDonnee();

    // Disable the navigation buttons
    this.navigationService.setNextDonnee(null);
    this.navigationService.setPreviousDonnee(null);

    this.navigationService.updatePreviousAndNextDonnees(
      this.donneeToSave,
      null,
      newNextDonnee
    );
  }

  public onNextDonneeBtnClicked(): void {
    this.mode = this.navigationService.getNextMode();
    if (this.modeHelper.isInventaireMode(this.mode)) {
      this.switchToInventaireMode();
    } else if (this.modeHelper.isDonneeMode(this.mode)) {
      this.switchToEditionDonneeMode();
    }

    const newPreviousDonnee = this.donneeToSave;

    this.donneeToSave = this.navigationService.nextDonnee;
    this.inventaireToSave = this.donneeToSave.inventaire;
    this.navigationService.increaseIndexOfCurrentDonnee();

    // Disable the navigation buttons
    this.navigationService.setNextDonnee(null);
    this.navigationService.setPreviousDonnee(null);

    this.navigationService.updatePreviousAndNextDonnees(
      this.donneeToSave,
      newPreviousDonnee,
      null
    );
  }

  public onNewInventaireBtnClicked(): void {
    this.switchToNewInventaireMode();
  }

  public onEditInventaireBtnClicked(): void {
    this.switchToInventaireMode();
  }
  private setCurrentDonneeToTheNextDonnee(afterDelete: boolean = false): void {
    this.mode = this.navigationService.getNextMode();
    if (this.modeHelper.isInventaireMode(this.mode)) {
      this.switchToInventaireMode();
    } else if (this.modeHelper.isDonneeMode(this.mode)) {
      this.switchToEditionDonneeMode();
    }

    this.inventaireToSave = this.navigationService.getNextInventaire();
    this.donneeToSave = this.navigationService.getNextDonnee();

    console.log(
      "Mode et inventaire et donnée courants:",
      this.mode.toString(),
      this.inventaireToSave,
      this.donneeToSave
    );
    console.log(
      "Index de la donnée courante",
      this.navigationService.currentDonneeIndex
    );
  }

  private setNewNextDonnee() {
    this.navigationService.updateNextDonnee(this.donneeToSave);
  }
  public deleteDonnee(donnee: Donnee): void {
    this.creationService.deleteDonnee(donnee.id).subscribe(
      (result: EntiteResult<Donnee>) => {
        this.onDeleteSuccess(result);
      },
      (error: any) => {
        this.onDeleteError(error);
      }
    );
  }

  private onDeleteSuccess(result: EntiteResult<Donnee>): void {
    this.updatePageStatus(result.status, result.messages);

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
    return (
      this.isDonneeDisabled ||
      !this.selectedComportements[index - 2] ||
      !this.selectedComportements[index - 2].id
    );
  }

  public isMilieuDisabled(index: number): boolean {
    return (
      this.isDonneeDisabled ||
      !this.selectedMilieux[index - 2] ||
      !this.selectedComportements[index - 2].id
    );
  }

  public addComportement(
    event: InputCodeLibelleEventObject,
    index: number
  ): void {
    this.selectedComportements[index] = event.value;
  }

  public addMilieu(event: InputCodeLibelleEventObject, index: number): void {
    this.selectedMilieux[index] = event.value;
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
    return this.navigationService.hasNextDonnee();
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
    const deleteDialogData = new ConfirmationDialogData(
      "Confirmation de suppression",
      "Êtes-vous certain de vouloir supprimer cette fiche espèce ?",
      "Oui, supprimer",
      "Non, annuler"
    );
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: "450px",
      data: deleteDialogData
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!!result) {
        this.onDeleteConfirmButtonClicked();
      }
    });
  }

  public onDeleteConfirmButtonClicked(): void {
    this.deleteDonnee(this.donneeToSave);
  }

  private redisplayCurrentInventaireAndDonnee(): void {
    this.mode = this.navigationService.savedMode;
    if (this.modeHelper.isInventaireMode(this.mode)) {
      this.switchToInventaireMode();
      this.inventaireToSave = this.navigationService.savedInventaire;
      this.donneeToSave = new Donnee();
    } else if (this.modeHelper.isDonneeMode(this.mode)) {
      this.switchToEditionDonneeMode();
      this.inventaireToSave = this.navigationService.savedInventaire;
      this.donneeToSave = this.navigationService.savedDonnee;
    }
  }

  private switchToNewInventaireMode(): void {
    this.inventaireToSave = new Inventaire();
    this.donneeToSave = new Donnee();
    this.initInventaireDefaultValues();
    this.initializeDonneePanel();

    this.switchToInventaireMode();
  }

  private switchToInventaireMode(): void {
    this.mode = CreationMode.NEW_INVENTAIRE;
    this.isDonneeDisabled = true;
    this.isInventaireDisabled = false;
    document.getElementById("input-observateur").focus();
  }

  private switchToEditionDonneeMode(): void {
    this.mode = CreationMode.NEW_DONNEE;
    this.isDonneeDisabled = false;
    this.isInventaireDisabled = true;
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

  public onSearchByIdBtnClicked(): void {
    const dialogRef = this.dialog.open(SearchByIdDialogComponent, {
      width: "450px"
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!!result) {
        // TODO search donnée par ID
        alert("Fonctionnalitée non supportée");
      }
    });
  }

  /**
   * Call the backend to update the fiche inventaire and fiche espece
   * If the user wants to update the fiche inventaire only for this fiche espece then we create a new inventaire
   * @param createNewInventaire If we should create a new inventaire for the donnee or just update it
   */
  private updateInventaireAndDonnee(createNewInventaire: boolean): void {
    if (!!createNewInventaire) {
      this.inventaireToSave.id = null;

      console.log("L'inventaire à créer est", this.inventaireToSave);

      this.inventaireService.saveInventaire(this.inventaireToSave).subscribe(
        (result: EntiteResult<Inventaire>) => {
          if (this.isSuccessStatus(result.status)) {
            this.inventaireToSave = result.object;
            this.donneeToSave.inventaire = this.inventaireToSave;
            this.updateDonnee();
          } else {
            this.updatePageStatus(result.status, result.messages);
          }
        },
        (error: any) => {
          this.onUpdateDonneeAndInventaireError(error);
        }
      );
    } else {
      this.updateDonnee();
    }
  }

  private updateDonnee(): void {
    console.log("La donnée à mettre à jour est", this.donneeToSave);

    this.donneeService.saveDonnee(this.donneeToSave).subscribe(
      (result: EntiteResult<Donnee>) => {
        this.updatePageStatus(result.status, result.messages);

        if (this.isSuccess()) {
          this.donneeToSave = result.object;
        }
      },
      (error: any) => {
        this.onUpdateDonneeAndInventaireError(error);
      }
    );
  }

  private onUpdateDonneeAndInventaireError(error: any): void {
    console.log(
      "Impossible de mettre à jour la fiche inventaire et la fiche espèce.",
      error
    );
    this.setErrorMessage(
      "Impossible de mettre à jour la fiche inventaire et la fiche espèce affichées."
    );
  }
}
