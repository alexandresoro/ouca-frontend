import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material";
import moment from "moment";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ConfirmationDialogData } from "../../components/dialog/confirmation-dialog-data.object";
import { ConfirmationDialogComponent } from "../../components/dialog/confirmation-dialog.component";
import { SearchByIdDialogComponent } from "../../components/search-by-id-dialog/search-by-id-dialog.component";
import { Age } from "../../model/age.object";
import { Commune } from "../../model/commune.object";
import { Comportement } from "../../model/comportement.object";
import { CreationPage } from "../../model/creation-page.object";
import { Departement } from "../../model/departement.object";
import { Donnee } from "../../model/donnee.object";
import { EntiteAvecLibelleEtCode } from "../../model/entite-avec-libelle-et-code.object";
import { EntiteResult } from "../../model/entite-result.object";
import { EstimationNombre } from "../../model/estimation-nombre.object";
import { Inventaire } from "../../model/inventaire.object";
import { Lieudit } from "../../model/lieudit.object";
import { Meteo } from "../../model/meteo.object";
import { Milieu } from "../../model/milieu.object";
import { Observateur } from "../../model/observateur.object";
import { Sexe } from "../../model/sexe.object";
import { ListHelper } from "../../services/list-helper";
import { PageComponent } from "../page.component";
import { CreationModeEnum, CreationModeHelper } from "./creation-mode.enum";
import { CreationService } from "./creation.service";
import { DonneeService } from "./donnee.service";
import { InventaireService } from "./inventaire.service";
import { NavigationService } from "./navigation.service";

@Component({
  templateUrl: "./creation.tpl.html"
})
export class CreationComponent extends PageComponent implements OnInit {
  public pageModel: CreationPage = {} as CreationPage;

  public mode: CreationModeEnum;

  public displayedInventaireId: number = null;

  public displayedDonneeId: number = null;

  public nextRegroupement: number;

  private listHelper: ListHelper;

  public communes$: Observable<Commune[]>;

  public inventaireForm: FormGroup = new FormGroup({
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

  public donneeForm: FormGroup = new FormGroup({
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
    comportementsGroup: new FormGroup({
      comportement1: new FormControl(""),
      comportement2: new FormControl(""),
      comportement3: new FormControl(""),
      comportement4: new FormControl(""),
      comportement5: new FormControl(""),
      comportement6: new FormControl("")
    }),
    milieuxGroup: new FormGroup({
      milieu1: new FormControl(""),
      milieu2: new FormControl(""),
      milieu3: new FormControl(""),
      milieu4: new FormControl("")
    }),
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

    this.communes$ = this.creationService
      .getInitialPageModel()
      .pipe(map((creationPage) => (creationPage ? creationPage.communes : [])));
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

    this.listHelper = new ListHelper(
      this.pageModel.ages,
      this.pageModel.classes,
      this.pageModel.communes,
      this.pageModel.comportements,
      this.pageModel.departements,
      this.pageModel.estimationsDistance,
      this.pageModel.estimationsNombre,
      this.pageModel.lieudits,
      this.pageModel.meteos,
      this.pageModel.milieux,
      this.pageModel.observateurs,
      this.pageModel.sexes
    );

    // Page model is ready, initalize the page to create a first inventaire
    this.switchToNewInventaireMode();
  }

  /**
   * Initialize the page to be ready to create an inventaire
   */
  private switchToNewInventaireMode(): void {
    this.initializeInventaireFormControls();
    this.initializeDonneeFormControls();

    this.switchToInventaireMode();
  }

  /**
   * Initialize the inventaire form
   * Reset the form and set defaults values if any
   */
  private initializeInventaireFormControls(): void {
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

    this.inventaireForm.markAsUntouched();
  }

  /**
   * Returns an inventaire object from the values filled in the inventaire form
   */
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

    console.log("Inventaire généré depuis le formulaire:", inventaire);

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

  /**
   * Fill the inventaire form with the values from an existing inventaire
   * @param inventaire Inventaire
   */
  private setInventaireFormControlsFromInventaire(
    inventaire: Inventaire
  ): void {
    console.log("Inventaire à afficher dans le formulaire:", inventaire);

    let commune: Commune = null;
    if (!!inventaire.lieudit && !!inventaire.lieudit.communeId) {
      commune = this.listHelper.getCommuneById(inventaire.lieudit.communeId);
    }

    let departement: Departement = null;
    if (!!commune && !!commune.departementId) {
      departement = this.listHelper.getDepartementById(commune.departementId);
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
   * Initialize the donnee form
   * Reset the form and set defaults values if any
   */
  private initializeDonneeFormControls(): void {
    let defaultAge: Age = null;
    if (!!this.pageModel.defaultAge && !!this.pageModel.defaultAge.id) {
      defaultAge = this.listHelper.getAgeById(this.pageModel.defaultAge.id);
    }

    let defaultSexe: Sexe = null;
    if (!!this.pageModel.defaultSexe && !!this.pageModel.defaultSexe.id) {
      defaultSexe = this.listHelper.getSexeById(this.pageModel.defaultSexe.id);
    }

    let defaultEstimationNombre: EstimationNombre = null;
    if (
      !!this.pageModel.defaultEstimationNombre &&
      !!this.pageModel.defaultEstimationNombre.id
    ) {
      defaultEstimationNombre = this.listHelper.getEstimationNombreById(
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
    const comportementsFormControls = (donneeFormControls.comportementsGroup as FormGroup)
      .controls;
    const milieuxFormControls = (donneeFormControls.milieuxGroup as FormGroup)
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
    comportementsFormControls.comportement1.setValue(null);
    comportementsFormControls.comportement2.setValue(null);
    comportementsFormControls.comportement3.setValue(null);
    comportementsFormControls.comportement4.setValue(null);
    comportementsFormControls.comportement5.setValue(null);
    comportementsFormControls.comportement6.setValue(null);
    milieuxFormControls.milieu1.setValue(null);
    milieuxFormControls.milieu2.setValue(null);
    milieuxFormControls.milieu3.setValue(null);
    milieuxFormControls.milieu4.setValue(null);
    donneeFormControls.commentaire.setValue(null);

    this.donneeForm.markAsUntouched();
    document.getElementById("input-Espèce").focus();
  }

  /**
   * Returns a donnee object from the values filled in donnee form
   */
  private getDonneeFromDonneeFormControls(): Donnee {
    const donneeFormControls = this.donneeForm.controls;
    const nombreFormControls = (donneeFormControls.nombreGroup as FormGroup)
      .controls;
    const distanceFormControls = (donneeFormControls.distanceGroup as FormGroup)
      .controls;
    const especeFormControls = (donneeFormControls.especeGroup as FormGroup)
      .controls;
    const comportementsFormControls = (donneeFormControls.comportementsGroup as FormGroup)
      .controls;
    const milieuxFormControls = (donneeFormControls.milieuxGroup as FormGroup)
      .controls;

    const comportements: Comportement[] = [];
    this.addComportement(
      comportements,
      comportementsFormControls.comportement1.value
    );
    this.addComportement(
      comportements,
      comportementsFormControls.comportement2.value
    );
    this.addComportement(
      comportements,
      comportementsFormControls.comportement3.value
    );
    this.addComportement(
      comportements,
      comportementsFormControls.comportement4.value
    );
    this.addComportement(
      comportements,
      comportementsFormControls.comportement5.value
    );
    this.addComportement(
      comportements,
      comportementsFormControls.comportement6.value
    );

    const milieux: Milieu[] = [];
    this.addMilieu(milieux, milieuxFormControls.milieu1.value);
    this.addMilieu(milieux, milieuxFormControls.milieu2.value);
    this.addMilieu(milieux, milieuxFormControls.milieu3.value);
    this.addMilieu(milieux, milieuxFormControls.milieu4.value);

    const donnee: Donnee = {
      id: this.displayedDonneeId,
      inventaireId: this.displayedInventaireId,
      espece: especeFormControls.espece.value,
      nombre: nombreFormControls.nombre.value,
      estimationNombre: nombreFormControls.estimationNombre.value,
      sexe: donneeFormControls.sexe.value,
      age: donneeFormControls.age.value,
      distance: distanceFormControls.distance.value,
      estimationDistance: distanceFormControls.estimationDistance.value,
      regroupement: donneeFormControls.regroupement.value,
      comportements,
      milieux,
      commentaire: donneeFormControls.commentaire.value
    };

    console.log("Donnée générée depuis le formulaire:", donnee);

    return donnee;
  }

  /**
   * Fill the donnee form with the values of an existing donnee
   */
  private setDonneeFormControlsFromDonnee(donnee: Donnee): void {
    console.log("Donnée à afficher dans le formulaire:", donnee);

    this.displayedDonneeId = donnee.id;

    const donneeFormControls = this.donneeForm.controls;
    const nombreFormControls = (donneeFormControls.nombreGroup as FormGroup)
      .controls;
    const distanceFormControls = (donneeFormControls.distanceGroup as FormGroup)
      .controls;
    const especeFormControls = (donneeFormControls.especeGroup as FormGroup)
      .controls;
    const comportementsFormControls = (donneeFormControls.comportementsGroup as FormGroup)
      .controls;
    const milieuxFormControls = (donneeFormControls.milieuxGroup as FormGroup)
      .controls;

    especeFormControls.classe.setValue(
      this.listHelper.getClasseById(donnee.espece.classeId)
    );
    especeFormControls.espece.setValue(donnee.espece);
    nombreFormControls.nombre.setValue(donnee.nombre);
    nombreFormControls.estimationNombre.setValue(donnee.estimationNombre);
    if (!!donnee.estimationNombre && !!donnee.estimationNombre.nonCompte) {
      nombreFormControls.nombre.disable();
    }
    donneeFormControls.sexe.setValue(donnee.sexe);
    donneeFormControls.age.setValue(donnee.age);
    distanceFormControls.distance.setValue(donnee.distance);
    distanceFormControls.estimationDistance.setValue(donnee.estimationDistance);
    donneeFormControls.regroupement.setValue(donnee.regroupement);
    comportementsFormControls.comportement1.setValue(
      this.getComportement(donnee.comportements, 1)
    );
    comportementsFormControls.comportement2.setValue(
      this.getComportement(donnee.comportements, 2)
    );
    comportementsFormControls.comportement3.setValue(
      this.getComportement(donnee.comportements, 3)
    );
    comportementsFormControls.comportement4.setValue(
      this.getComportement(donnee.comportements, 4)
    );
    comportementsFormControls.comportement5.setValue(
      this.getComportement(donnee.comportements, 5)
    );
    comportementsFormControls.comportement6.setValue(
      this.getComportement(donnee.comportements, 6)
    );
    milieuxFormControls.milieu1.setValue(this.getMilieu(donnee.milieux, 1));
    milieuxFormControls.milieu2.setValue(this.getMilieu(donnee.milieux, 2));
    milieuxFormControls.milieu3.setValue(this.getMilieu(donnee.milieux, 3));
    milieuxFormControls.milieu4.setValue(this.getMilieu(donnee.milieux, 4));
    donneeFormControls.commentaire.setValue(donnee.commentaire);
  }

  /**
   * Add the entity to the list of entities if this entity is not already part of the list
   * @param entitesCodeEtLibelle list to complete
   * @param entiteCodeEtLibelle entity to add
   */
  private addEntiteCodeEtLibelle(
    entitesCodeEtLibelle: EntiteAvecLibelleEtCode[],
    entiteCodeEtLibelle: EntiteAvecLibelleEtCode
  ): void {
    if (
      !!entiteCodeEtLibelle &&
      entitesCodeEtLibelle.indexOf(entiteCodeEtLibelle) < 0
    ) {
      entitesCodeEtLibelle.push(entiteCodeEtLibelle);
    }
  }

  /**
   * Get the entity stored at index of a list if it exists
   * @param entitesCodeEtLibelle list of entities
   * @param index index of the entity to return
   */
  private getEntiteCodeEtLibelle(
    entitesCodeEtLibelle: EntiteAvecLibelleEtCode[],
    index: number
  ): EntiteAvecLibelleEtCode {
    return entitesCodeEtLibelle.length >= index &&
      !!entitesCodeEtLibelle[index - 1]
      ? entitesCodeEtLibelle[index - 1]
      : null;
  }

  /**
   * Returns the comportement at specified index if it exists
   * @param comportements list of comportements
   * @param index index of the comportement to return
   */
  private getComportement(
    comportements: Comportement[],
    index: number
  ): Comportement {
    return this.getEntiteCodeEtLibelle(comportements, index);
  }

  /**
   * Add a comportement to the list of comportements if not already in the list
   * @param comportements list of comportements
   * @param comportement comportement to add in the list
   */
  private addComportement(
    comportements: Comportement[],
    comportement: Comportement
  ): void {
    this.addEntiteCodeEtLibelle(comportements, comportement);
  }

  /**
   * Returns the milieu at specified index if it exists
   * @param milieux list of milieux
   * @param index index of the milieu to return
   */
  private getMilieu(milieux: Milieu[], index: number): Milieu {
    return this.getEntiteCodeEtLibelle(milieux, index);
  }

  /**
   * Add a milieu to the list of milieux if not already in the list
   * @param milieux list of milieux
   * @param milieu milieu to add in the list
   */
  private addMilieu(milieux: Milieu[], milieu: Milieu): void {
    this.addEntiteCodeEtLibelle(milieux, milieu);
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

  private onSaveInventaireError(error: any): void {
    this.setErrorMessage("L'inventaire n'a pas pu êtr créé/modifié.");
    console.error(
      "Impossible de créer l'inventaire.\nDétails de l'erreur:" + error
    );
  }

  private onSaveInventaireSuccess(savedInventaire: Inventaire): void {
    // this.setInventaireFormControlsFromInventaire(savedInventaire);
    this.displayedInventaireId = savedInventaire.id;
    this.switchToEditionDonneeMode();
  }

  /**
   * Called when clicking on Save Donnee button
   */
  public saveDonnee(): void {
    const donneeToBeSaved: Donnee = this.getDonneeFromDonneeFormControls();

    this.donneeService.saveDonnee(donneeToBeSaved).subscribe(
      (result: EntiteResult<Donnee>) => {
        this.updatePageStatus(result.status, result.messages);

        if (this.isSuccess()) {
          this.onSaveDonneeSuccess(result.object);
        }
      },
      (error: any) => {
        this.onSaveDonneeError(error);
      }
    );
  }

  private onSaveDonneeError(error: any) {
    this.setErrorMessage("La donnée n'a pas pu être créée ou modifiée.");
    console.error(
      "Impossible de créer la donnée.\nDétails de l'erreur:" + error
    );
  }

  private onSaveDonneeSuccess(savedDonnee: Donnee) {
    this.navigationService.updateNavigationAfterADonneeWasSaved(savedDonnee);

    this.updateNextRegroupement();

    this.initializeDonneeFormControls();
  }

  /**
   * Called when a donnee is saved to get the next regroupement number
   */
  private updateNextRegroupement(): void {
    this.creationService.getNextRegroupement().subscribe(
      (regroupement: number) => {
        this.nextRegroupement = regroupement;
      },
      (error: any) => {
        console.error(
          "Impossible de récupérer le prochain regroupement (" + error + ")"
        );
      }
    );
  }

  /**
   * Called when clicking on save donnee when in update mode
   */
  // TODO
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
    const currentInventaire: Inventaire = this.getInventaireFromInventaireFormControls();
    const currentDonnee: Donnee = this.getDonneeFromDonneeFormControls();

    // Save the current donnee, inventaire and mode
    if (!this.modeHelper.isUpdateMode(this.mode)) {
      this.navigationService.saveCurrentContext(
        this.mode,
        currentInventaire,
        currentDonnee
      );
      this.switchToUpdateMode();
    }

    let newNextDonnee = currentDonnee;
    if (!!!this.navigationService.currentDonneeIndex) {
      // We are displaying the creation form so the next donnee is the saved donnee
      newNextDonnee = this.navigationService.savedDonnee;
    }

    // Set the current donnee to display
    const newCurrentDonnee: Donnee = this.navigationService.previousDonnee;
    this.setDonneeFormControlsFromDonnee(newCurrentDonnee);
    this.setInventaireFormControlsFromInventaire(newCurrentDonnee.inventaire);
    this.navigationService.decreaseIndexOfCurrentDonnee();

    // Disable the navigation buttons
    this.navigationService.setNextDonnee(null);
    this.navigationService.setPreviousDonnee(null);

    this.navigationService.updatePreviousAndNextDonnees(
      newCurrentDonnee,
      null,
      newNextDonnee
    );
  }

  public onNextDonneeBtnClicked(): void {
    const currentDonnee: Donnee = this.getDonneeFromDonneeFormControls();

    this.mode = this.navigationService.getNextMode();
    if (this.modeHelper.isInventaireMode(this.mode)) {
      this.switchToInventaireMode();
    } else if (this.modeHelper.isDonneeMode(this.mode)) {
      this.switchToEditionDonneeMode();
    }

    const newPreviousDonnee: Donnee = currentDonnee;

    const newCurrentDonnee: Donnee = this.navigationService.nextDonnee;
    this.setInventaireFormControlsFromInventaire(newCurrentDonnee.inventaire);
    this.setDonneeFormControlsFromDonnee(newCurrentDonnee);
    this.navigationService.increaseIndexOfCurrentDonnee();

    // Disable the navigation buttons
    this.navigationService.setNextDonnee(null);
    this.navigationService.setPreviousDonnee(null);

    this.navigationService.updatePreviousAndNextDonnees(
      newCurrentDonnee,
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

    this.setInventaireFormControlsFromInventaire(
      this.navigationService.getNextInventaire()
    );
    const newCurrentDonnee: Donnee = this.navigationService.getNextDonnee();
    this.setDonneeFormControlsFromDonnee(newCurrentDonnee);
  }

  private setNewNextDonnee(currentDonnee: Donnee) {
    this.navigationService.updateNextDonnee(currentDonnee);
  }

  public deleteDonnee(donneeId: number): void {
    this.creationService.deleteDonnee(donneeId).subscribe(
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
      this.setNewNextDonnee(result.object);

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
    this.redisplayCurrentInventaireAndDonnee();
  }
  public onNewDonneeBtnClicked(): void {
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
    this.deleteDonnee(this.displayedDonneeId);
  }

  private redisplayCurrentInventaireAndDonnee(): void {
    this.mode = this.navigationService.savedMode;
    if (this.modeHelper.isInventaireMode(this.mode)) {
      this.switchToInventaireMode();
      this.setInventaireFormControlsFromInventaire(
        this.navigationService.savedInventaire
      );
      this.displayedDonneeId = null;
    } else if (this.modeHelper.isDonneeMode(this.mode)) {
      this.switchToEditionDonneeMode();
      this.setInventaireFormControlsFromInventaire(
        this.navigationService.savedInventaire
      );
      this.setDonneeFormControlsFromDonnee(this.navigationService.savedDonnee);
    }
  }

  private switchToInventaireMode(): void {
    this.mode = CreationModeEnum.NEW_INVENTAIRE;
    this.handleInventaireFormState(true);
    this.handleDonneeFormState(false);
    document.getElementById("input-Observateur").focus();
  }

  private switchToEditionDonneeMode(): void {
    this.mode = CreationModeEnum.NEW_DONNEE;
    this.handleInventaireFormState(false);
    this.handleDonneeFormState(true);
    document.getElementById("input-Espèce").focus();
  }

  private switchToUpdateMode(): void {
    this.mode = CreationModeEnum.UPDATE;
    this.handleInventaireFormState(true);
    this.handleDonneeFormState(true);
    document.getElementById("input-Observateur").focus();
  }

  private handleInventaireFormState(toEnable: boolean): void {
    if (toEnable) {
      this.inventaireForm.enable();
    } else {
      this.inventaireForm.disable();
    }
  }

  private handleDonneeFormState(toEnable: boolean): void {
    if (toEnable) {
      this.donneeForm.enable();
    } else {
      this.donneeForm.disable();
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
            const savedInventaire: Inventaire = result.object;
            this.setInventaireFormControlsFromInventaire(savedInventaire);
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
    const donneeToBeSaved: Donnee = this.getDonneeFromDonneeFormControls();
    this.donneeService.saveDonnee(donneeToBeSaved).subscribe(
      (result: EntiteResult<Donnee>) => {
        this.updatePageStatus(result.status, result.messages);

        if (this.isSuccess()) {
          this.setDonneeFormControlsFromDonnee(result.object);
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
