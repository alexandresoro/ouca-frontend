import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Age } from "basenaturaliste-model/age.object";
import { Comportement } from "basenaturaliste-model/comportement.object";
import { CreationPage } from "basenaturaliste-model/creation-page.object";
import { Donnee } from "basenaturaliste-model/donnee.object";
import { EntiteAvecLibelleEtCode } from "basenaturaliste-model/entite-avec-libelle-et-code.object";
import { EstimationNombre } from "basenaturaliste-model/estimation-nombre.object";
import { Milieu } from "basenaturaliste-model/milieu.object";
import { Sexe } from "basenaturaliste-model/sexe.object";
import { ListHelper } from "../../shared/helpers/list-helper";
import { InventaireHelper } from "./inventaire.helper";

export class DonneeHelper {
  private static displayedDonneeId: number = null;

  public static getDisplayedDonneeId(): number {
    return this.displayedDonneeId;
  }

  public static setDisplayedDonneeId(id: number) {
    this.displayedDonneeId = id;
  }

  public static createDonneeForm() {
    this.displayedDonneeId = null;

    return new FormGroup({
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
  }

  /**
   * Initialize the donnee form
   * Reset the form and set defaults values if any
   */
  public static initializeDonneeForm(
    donneeForm: FormGroup,
    pageModel: CreationPage
  ): void {
    let defaultAge: Age = null;
    if (!!pageModel.defaultAgeId) {
      defaultAge = ListHelper.getFromList(
        pageModel.ages,
        "id",
        pageModel.defaultAgeId
      );
    }

    let defaultSexe: Sexe = null;
    if (!!pageModel.defaultSexeId) {
      defaultSexe = ListHelper.getFromList(
        pageModel.sexes,
        "id",
        pageModel.defaultSexeId
      );
    }

    let defaultEstimationNombre: EstimationNombre = null;
    if (!!pageModel.defaultEstimationNombreId) {
      defaultEstimationNombre = ListHelper.getFromList(
        pageModel.estimationsNombre,
        "id",
        pageModel.defaultEstimationNombreId
      );
    }

    let defaultNombre: number = null;
    if (
      !!pageModel.defaultNombre &&
      (!!!defaultEstimationNombre ||
        (!!defaultEstimationNombre && !defaultEstimationNombre.nonCompte))
    ) {
      defaultNombre = pageModel.defaultNombre;
    }

    this.displayedDonneeId = null;

    const donneeFormControls = donneeForm.controls;
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

    donneeForm.markAsUntouched();
    document.getElementById("input-Espèce").focus();
  }

  /**
   * Returns a donnee object from the values filled in donnee form
   */
  public static getDonneeFromDonneeForm(donneeForm: FormGroup): Donnee {
    const donneeFormControls = donneeForm.controls;
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

    console.log(comportementsFormControls);

    const comportementsIds: number[] = [];
    this.addComportement(
      comportementsIds,
      comportementsFormControls.comportement1.value
    );
    this.addComportement(
      comportementsIds,
      comportementsFormControls.comportement2.value
    );
    this.addComportement(
      comportementsIds,
      comportementsFormControls.comportement3.value
    );
    this.addComportement(
      comportementsIds,
      comportementsFormControls.comportement4.value
    );
    this.addComportement(
      comportementsIds,
      comportementsFormControls.comportement5.value
    );
    this.addComportement(
      comportementsIds,
      comportementsFormControls.comportement6.value
    );

    const milieuxIds: number[] = [];
    this.addMilieu(milieuxIds, milieuxFormControls.milieu1.value);
    this.addMilieu(milieuxIds, milieuxFormControls.milieu2.value);
    this.addMilieu(milieuxIds, milieuxFormControls.milieu3.value);
    this.addMilieu(milieuxIds, milieuxFormControls.milieu4.value);

    const donnee: any = {
      id: this.displayedDonneeId,
      inventaireId: InventaireHelper.getDisplayedInventaireId(),
      especeId: especeFormControls.espece.value.id,
      nombre: nombreFormControls.nombre.value,
      estimationNombreId: nombreFormControls.estimationNombre.value.id,
      sexeId: donneeFormControls.sexe.value.id,
      ageId: donneeFormControls.age.value.id,
      distance: distanceFormControls.distance.value,
      estimationDistanceId: !!distanceFormControls.estimationDistance.value
        ? distanceFormControls.estimationDistance.value.id
        : null,
      regroupement: donneeFormControls.regroupement.value,
      comportementsIds,
      milieuxIds,
      commentaire: donneeFormControls.commentaire.value
    };

    console.log("Donnée générée depuis le formulaire:", donnee);

    return donnee;
  }

  /**
   * Fill the donnee form with the values of an existing donnee
   */
  public static setDonneeFormFromDonnee(
    donneeForm: FormGroup,
    donnee: Donnee,
    pageModel: CreationPage
  ): void {
    console.log("Donnée à afficher dans le formulaire:", donnee);

    this.displayedDonneeId = donnee.id;

    const donneeFormControls = donneeForm.controls;
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
      ListHelper.getFromList(pageModel.classes, "id", donnee.espece.classeId)
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
   * Add the id to the list of ids if this id is not already part of the list
   * @param ids list to complete
   * @param id id to add
   */
  private static addId(ids: number[], id: number): void {
    if (!!id && ids.indexOf(id) < 0) {
      ids.push(id);
    }
  }

  /**
   * Get the entity stored at index of a list if it exists
   * @param entitesCodeEtLibelle list of entities
   * @param index index of the entity to return
   */
  private static getEntiteCodeEtLibelle(
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
  private static getComportement(
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
  private static addComportement(
    comportementsIds: number[],
    comportement: Comportement
  ): void {
    if (!!comportement && !!comportement.id) {
      this.addId(comportementsIds, comportement.id);
    }
  }

  /**
   * Returns the milieu at specified index if it exists
   * @param milieux list of milieux
   * @param index index of the milieu to return
   */
  private static getMilieu(milieux: Milieu[], index: number): Milieu {
    return this.getEntiteCodeEtLibelle(milieux, index);
  }

  /**
   * Add a milieu to the list of milieux if not already in the list
   * @param milieux list of milieux
   * @param milieu milieu to add in the list
   */
  private static addMilieu(milieuxIds: number[], milieu: Milieu): void {
    if (!!milieu && !!milieu.id) {
      this.addId(milieuxIds, milieu.id);
    }
  }
}
