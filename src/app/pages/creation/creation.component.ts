import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material";
import moment from "moment";
import { ConfirmationDialogData } from "../../components/dialog/confirmation-dialog-data.object";
import { ConfirmationDialogComponent } from "../../components/dialog/confirmation-dialog.component";
import { SearchByIdDialogComponent } from "../../components/search-by-id-dialog/search-by-id-dialog.component";
import { Age } from "../../model/age.object";
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
import { Meteo } from "../../model/meteo.object";
import { Milieu } from "../../model/milieu.object";
import { Observateur } from "../../model/observateur.object";
import { Sexe } from "../../model/sexe.object";
import { PageComponent } from "../page.component";
import { CreationMode, CreationModeHelper } from "./creation-mode.enum";
import { CreationService } from "./creation.service";
import { DonneeService } from "./donnee.service";
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

  public testAlex: boolean;

  // public inventaireToSave: Inventaire = new Inventaire();
  public displayedInventaireId: number = null;
  public displayedDonneeId: number = null;

  public donneeToSave: Donnee = new Donnee();

  public selectedClasse: Classe;
  public selectedComportements: Comportement[] = new Array<Comportement>(6);
  public selectedMilieux: Comportement[] = new Array<Comportement>(6);
  public nextRegroupement: number;

  public filteredCommunes: Commune[];
  public filteredLieuxdits: Lieudit[];
  public filteredEspeces: Espece[];

  inventaireForm = new FormGroup({
    observateur: new FormControl("", Validators.required),
    observateursAssocies: new FormControl(""),
    date: new FormControl("", Validators.required),
    heure: new FormControl(""),
    duree: new FormControl(""),
    lieu: new FormGroup({
      departement: new FormControl("", Validators.required),
      commune: new FormControl("", Validators.required),
      lieudit: new FormControl("", Validators.required),
      altitude: new FormControl("", Validators.required),
      longitude: new FormControl("", Validators.required),
      latitude: new FormControl("", Validators.required)
    }),
    temperature: new FormControl(""),
    meteos: new FormControl("")
  });

  // TODO nombre is required only when estimationNombre is not Non compté
  donneeForm = new FormGroup({
    especeGroup: new FormGroup({
      classe: new FormControl(""),
      espece: new FormControl("", Validators.required)
    }),
    nombreGroup: new FormGroup({
      nombre: new FormControl("", Validators.required),
      estimationNombre: new FormControl("", Validators.required)
    }),
    sexe: new FormControl("", Validators.required),
    age: new FormControl("", Validators.required),
    distanceGroup: new FormGroup({
      distance: new FormControl(""),
      estimationDistance: new FormControl("")
    }),
    regroupement: new FormControl(""),
    comportement1: new FormControl(""),
    comportement2: new FormControl(""),
    comportement3: new FormControl(""),
    comportement4: new FormControl(""),
    comportement5: new FormControl(""),
    comportement6: new FormControl(""),
    milieu1: new FormControl(""),
    milieu2: new FormControl(""),
    milieu3: new FormControl(""),
    milieu4: new FormControl(""),
    commentaire: new FormControl("")
  });

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
    this.testAlex = false;
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

  private toggleDateDisabled = (): void => {
    this.testAlex = !this.testAlex;
    this.handleInventaireFormState(this.testAlex);
  }

  /**
   * If back-end call is successful, use the initial creation page model to build the page
   * @param creationPage: CreationPage
   */
  private onInitCreationPageSucces(creationPage: CreationPage): void {
    this.pageModel = creationPage;
    console.log("Modèle de la page de Création", this.pageModel);

    this.nextRegroupement = this.pageModel.nextRegroupement;

    this.navigationService.init(
      this.pageModel.lastDonnee,
      this.pageModel.numberOfDonnees
    );

    this.switchToNewInventaireMode();
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
    let defaultObservateur: Observateur = null;
    if (
      !!this.pageModel.defaultObservateur &&
      !!this.pageModel.defaultObservateur.id
    ) {
      defaultObservateur = this.pageModel.observateurs.find(
        (observateur) => observateur.id === this.pageModel.defaultObservateur.id
      );
    }

    let defaultDepartement: Departement = null;
    if (
      !!this.pageModel.defaultDepartement &&
      !!this.pageModel.defaultDepartement.id
    ) {
      defaultDepartement = this.pageModel.departements.find(
        (departement) => departement.id === this.pageModel.defaultDepartement.id
      );
    }

    this.displayedInventaireId = null;

    const inventaireFormControls = this.inventaireForm.controls;
    const lieuditFormControls = (inventaireFormControls.lieu as FormGroup)
      .controls;

    inventaireFormControls.observateur.setValue(defaultObservateur);
    inventaireFormControls.observateursAssocies.setValue(
      new Array<Observateur>()
    );
    inventaireFormControls.date.setValue(
      moment()
        .milliseconds(0)
        .seconds(0)
        .minutes(0)
        .hours(0)
    );
    inventaireFormControls.heure.setValue(null);
    inventaireFormControls.duree.setValue(null);
    lieuditFormControls.departement.setValue(defaultDepartement);
    lieuditFormControls.commune.setValue(null);
    lieuditFormControls.lieudit.setValue(null);
    lieuditFormControls.altitude.setValue(null);
    lieuditFormControls.longitude.setValue(null);
    lieuditFormControls.latitude.setValue(null);
    inventaireFormControls.temperature.setValue(null);
    inventaireFormControls.meteos.setValue(new Array<Meteo>());
  }

  private getInventaireFromInventaireFormControls(): Inventaire {
    const inventaireFormControls = this.inventaireForm.controls;
    const lieuditFormControls = (inventaireFormControls.lieu as FormGroup)
      .controls;

    const inventaire: Inventaire = {
      id: this.displayedInventaireId,
      observateur: inventaireFormControls.observateur.value,
      associes: inventaireFormControls.observateursAssocies.value,
      date: inventaireFormControls.date.value.toDate(),
      heure: inventaireFormControls.heure.value,
      duree: inventaireFormControls.duree.value,
      lieudit: lieuditFormControls.lieudit.value,
      altitude: lieuditFormControls.altitude.value,
      longitude: lieuditFormControls.longitude.value,
      latitude: lieuditFormControls.latitude.value,
      temperature: inventaireFormControls.temperature.value,
      meteos: inventaireFormControls.meteos.value
    };

    if (
      !this.areCoordinatesCustomized(
        inventaire.lieudit,
        inventaire.altitude,
        inventaire.longitude,
        inventaire.latitude
      )
    ) {
      inventaire.altitude = null;
      inventaire.longitude = null;
      inventaire.latitude = null;
    }

    console.log("Inventaire:", inventaire);

    return inventaire;
  }

  /**
   * Check if at least one of the coordinates has been modified by the user
   * @param lieudit selected lieu-dit
   * @param altitude current value of altitude
   * @param longitude current value of longitude
   * @param latitude current value of latitude
   */
  private areCoordinatesCustomized(
    lieudit: Lieudit,
    altitude: number,
    longitude: number,
    latitude: number
  ): boolean {
    return (
      altitude !== lieudit.altitude ||
      longitude !== lieudit.longitude ||
      latitude !== lieudit.latitude
    );
  }
  private setInventaireFormControlsFromInventaire(
    inventaire: Inventaire
  ): void {
    let commune: Commune = null;
    if (!!inventaire.lieudit && !!inventaire.lieudit.communeId) {
      commune = this.getCommuneById(inventaire.lieudit.communeId);
    }

    let departement: Departement = null;
    if (!!commune && !!commune.departementId) {
      departement = this.getDepartementById(commune.departementId);
    }

    this.displayedInventaireId = inventaire.id;

    const inventaireFormControls = this.inventaireForm.controls;
    const lieuditFormControls = (inventaireFormControls.lieu as FormGroup)
      .controls;

    inventaireFormControls.observateur.setValue(inventaire.observateur);
    inventaireFormControls.observateursAssocies.setValue(inventaire.associes);
    inventaireFormControls.date.setValue(inventaire.date);
    inventaireFormControls.heure.setValue(inventaire.heure);
    inventaireFormControls.duree.setValue(inventaire.duree);
    lieuditFormControls.departement.setValue(departement);
    lieuditFormControls.commune.setValue(commune);
    lieuditFormControls.lieudit.setValue(inventaire.lieudit);
    if (
      !!inventaire.altitude &&
      !!inventaire.longitude &&
      !!inventaire.latitude
    ) {
      lieuditFormControls.altitude.setValue(inventaire.altitude);
      lieuditFormControls.longitude.setValue(inventaire.longitude);
      lieuditFormControls.latitude.setValue(inventaire.latitude);
    } else {
      lieuditFormControls.altitude.setValue(inventaire.lieudit.altitude);
      lieuditFormControls.longitude.setValue(inventaire.lieudit.longitude);
      lieuditFormControls.latitude.setValue(inventaire.lieudit.latitude);
    }
    inventaireFormControls.temperature.setValue(inventaire.temperature);
    inventaireFormControls.meteos.setValue(inventaire.meteos);
  }

  /**
   * When creating a new donne, initialize the form
   */
  private initDonneeDefaultValues(): void {
    let defaultAge: Age = null;
    if (!!this.pageModel.defaultAge && !!this.pageModel.defaultAge.id) {
      defaultAge = this.getAgeById(this.pageModel.defaultAge.id);
    }

    let defaultSexe: Sexe = null;
    if (!!this.pageModel.defaultSexe && !!this.pageModel.defaultSexe.id) {
      defaultSexe = this.getSexeById(this.pageModel.defaultSexe.id);
    }

    let defaultEstimationNombre: EstimationNombre = null;
    if (
      !!this.pageModel.defaultEstimationNombre &&
      !!this.pageModel.defaultEstimationNombre.id
    ) {
      defaultEstimationNombre = this.getEstimationNombreById(
        this.pageModel.defaultEstimationNombre.id
      );
    }

    let defaultNombre: number = null;
    if (
      !!this.pageModel.defaultNombre &&
      (!!!defaultEstimationNombre ||
        (!!defaultEstimationNombre && !defaultEstimationNombre.nonCompte))
    ) {
      defaultNombre = this.pageModel.defaultNombre;
    }

    this.displayedDonneeId = null;

    const donneeFormControls = this.donneeForm.controls;
    const nombreFormControls = (donneeFormControls.nombreGroup as FormGroup)
      .controls;
    const distanceFormControls = (donneeFormControls.distanceGroup as FormGroup)
      .controls;
    const especeFormControls = (donneeFormControls.especeGroup as FormGroup)
      .controls;

    especeFormControls.classe.setValue(null);
    especeFormControls.espece.setValue(null);
    nombreFormControls.nombre.setValue(defaultNombre);
    nombreFormControls.estimationNombre.setValue(defaultEstimationNombre);
    if (!!defaultEstimationNombre && !!defaultEstimationNombre.nonCompte) {
      nombreFormControls.nombre.disable();
    }
    donneeFormControls.sexe.setValue(defaultSexe);
    donneeFormControls.age.setValue(defaultAge);
    distanceFormControls.distance.setValue(null);
    distanceFormControls.estimationDistance.setValue(null);
    donneeFormControls.regroupement.setValue(null);
    donneeFormControls.comportement1.setValue(null);
    donneeFormControls.comportement2.setValue(null);
    donneeFormControls.comportement3.setValue(null);
    donneeFormControls.comportement4.setValue(null);
    donneeFormControls.comportement5.setValue(null);
    donneeFormControls.comportement6.setValue(null);
    donneeFormControls.milieu1.setValue(null);
    donneeFormControls.milieu2.setValue(null);
    donneeFormControls.milieu3.setValue(null);
    donneeFormControls.milieu4.setValue(null);
    donneeFormControls.commentaire.setValue(null);

    /*
    // Especes
    // this.filteredEspeces = this.pageModel.especes;

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
    } */

    this.selectedComportements = [];
    this.selectedMilieux = [];
  }

  private testIdiot = () => {
    // TODO
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
    const inventaireToBeSaved: Inventaire = this.getInventaireFromInventaireFormControls();

    this.inventaireService.saveInventaire(inventaireToBeSaved).subscribe(
      (result: EntiteResult<Inventaire>) => {
        this.updatePageStatus(result.status, result.messages);

        if (this.isSuccess()) {
          this.onSaveInventaireSuccess(result.object);
        }
      },
      (error: any) => {
        this.onSaveInventaireError(error);
      }
    );
  }

  private onSaveInventaireSuccess(savedInventaire: Inventaire) {
    this.setInventaireFormControlsFromInventaire(savedInventaire);
    // this.donneeToSave = new Donnee();
    this.donneeToSave.inventaire = savedInventaire;

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
    // this.donneeToSave.inventaire = this.inventaireToSave;
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
    // this.selectedClasse = null; // TODO toutes or null?
    // this.updateEspeces();
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
        this.getInventaireFromInventaireFormControls(),
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
    // this.inventaireToSave = this.donneeToSave.inventaire;
    this.setInventaireFormControlsFromInventaire(this.donneeToSave.inventaire);
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
    // this.inventaireToSave = this.donneeToSave.inventaire;
    this.setInventaireFormControlsFromInventaire(this.donneeToSave.inventaire);
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

    // this.inventaireToSave = this.navigationService.getNextInventaire();
    this.setInventaireFormControlsFromInventaire(
      this.navigationService.getNextInventaire()
    );
    this.donneeToSave = this.navigationService.getNextDonnee();
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

  public addComportement(event: any, index: number): void {
    // TODO make this less crappy
    const isComportementSet = !!event.value;
    const nextComportement = index + 2;
    const nextComportementControl = this.donneeForm.controls[
      "comportement" + nextComportement
    ];

    if (!!nextComportementControl) {
      if (isComportementSet) {
        nextComportementControl.enable();
      } else {
        nextComportementControl.disable();
        nextComportementControl.setValue(null);
      }
    }
  }

  public addMilieu(event: any, index: number): void {
    // TODO make this less crappy
    const isComportementSet = !!event.value;
    const nextMilieu = index + 2;
    const nextMilieuControl = this.donneeForm.controls["milieu" + nextMilieu];

    if (!!nextMilieuControl) {
      if (isComportementSet) {
        nextMilieuControl.enable();
      } else {
        nextMilieuControl.disable();
        nextMilieuControl.setValue(null);
      }
    }
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
      // this.inventaireToSave = this.navigationService.savedInventaire;
      this.setInventaireFormControlsFromInventaire(
        this.navigationService.savedInventaire
      );
      this.donneeToSave = new Donnee();
    } else if (this.modeHelper.isDonneeMode(this.mode)) {
      this.switchToEditionDonneeMode();
      // this.inventaireToSave = this.navigationService.savedInventaire;
      this.setInventaireFormControlsFromInventaire(
        this.navigationService.savedInventaire
      );
      this.donneeToSave = this.navigationService.savedDonnee;
    }
  }

  private switchToNewInventaireMode(): void {
    // this.inventaireToSave = new Inventaire();
    // this.donneeToSave = new Donnee();
    this.initInventaireDefaultValues();
    this.initializeDonneePanel();

    this.switchToInventaireMode();
  }

  private switchToInventaireMode(): void {
    this.mode = CreationMode.NEW_INVENTAIRE;
    this.isDonneeDisabled = true;
    this.handleInventaireFormState(true);
    document.getElementById("input-Observateur").focus();
  }

  private switchToEditionDonneeMode(): void {
    this.mode = CreationMode.NEW_DONNEE;
    this.isDonneeDisabled = false;
    this.handleInventaireFormState(false);
    document.getElementById("input-code-espece").focus();
  }

  private switchToUpdateMode(): void {
    this.mode = CreationMode.UPDATE;
    this.isDonneeDisabled = false;
    this.handleInventaireFormState(true);
    document.getElementById("input-observateur").focus();
  }

  private handleInventaireFormState = (toEnable: boolean): void => {
    if (toEnable) {
      this.inventaireForm.enable();
    } else {
      this.inventaireForm.disable();
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
    const inventaireToBeSaved: Inventaire = this.getInventaireFromInventaireFormControls();

    if (!!createNewInventaire) {
      inventaireToBeSaved.id = null;

      console.log("L'inventaire à créer est", inventaireToBeSaved);

      this.inventaireService.saveInventaire(inventaireToBeSaved).subscribe(
        (result: EntiteResult<Inventaire>) => {
          if (this.isSuccessStatus(result.status)) {
            // this.inventaireToSave = result.object;
            const savedInventaire: Inventaire = result.object;
            this.setInventaireFormControlsFromInventaire(savedInventaire);
            this.donneeToSave.inventaire = savedInventaire;
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

  private getDepartementById(id: number): Departement {
    return this.pageModel.departements.find(
      (departement) => departement.id === id
    );
  }

  private getCommuneById(id: number): Commune {
    return this.pageModel.communes.find((commune) => commune.id === id);
  }

  private getAgeById(id: number): Age {
    return this.pageModel.ages.find((age) => age.id === id);
  }

  private getSexeById(id: number): Sexe {
    return this.pageModel.sexes.find((sexe) => sexe.id === id);
  }

  private getEstimationNombreById(id: number): EstimationNombre {
    return this.pageModel.estimationsNombre.find(
      (estimation) => estimation.id === id
    );
  }

  private displayComportementFormat = (comportement: Comportement): string => {
    return !!comportement
      ? comportement.code + " - " + comportement.libelle
      : null;
  }

  private displayMilieuFormat = (milieu: Milieu): string => {
    return !!milieu ? milieu.code + " - " + milieu.libelle : null;
  }
}
