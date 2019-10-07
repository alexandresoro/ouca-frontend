import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from "@angular/forms";
import { Age } from "basenaturaliste-model/age.object";
import { Classe } from "basenaturaliste-model/classe.object";
import { Comportement } from "basenaturaliste-model/comportement.object";
import { CreationPage } from "basenaturaliste-model/creation-page.object";
import { Donnee } from "basenaturaliste-model/donnee.object";
import { EntiteAvecLibelleEtCode } from "basenaturaliste-model/entite-avec-libelle-et-code.object";
import { Espece } from "basenaturaliste-model/espece.object";
import { EstimationDistance } from "basenaturaliste-model/estimation-distance.object";
import { EstimationNombre } from "basenaturaliste-model/estimation-nombre.object";
import { Milieu } from "basenaturaliste-model/milieu.object";
import { Sexe } from "basenaturaliste-model/sexe.object";
import { FormValidatorHelper } from "../../shared/helpers/form-validator.helper";
import { ListHelper } from "../../shared/helpers/list-helper";
import { InventaireHelper } from "./inventaire.helper";

export class DonneeHelper {
  private static displayedDonneeId: number = null;

  public static getDisplayedDonneeId(): number {
    return this.displayedDonneeId;
  }

  public static setDisplayedDonneeId(id: number): void {
    this.displayedDonneeId = id;
  }

  public static createDonneeForm(): FormGroup {
    this.displayedDonneeId = null;

    return new FormGroup({
      especeGroup: new FormGroup({
        classe: new FormControl("", [this.classeValidator()]),
        espece: new FormControl("", [
          Validators.required,
          this.especeValidator()
        ])
      }),
      nombreGroup: new FormGroup({
        nombre: new FormControl("", [
          Validators.required,
          this.nombreValidator()
        ]),
        estimationNombre: new FormControl("", [
          Validators.required,
          this.estimationNombreValidator()
        ])
      }),
      sexe: new FormControl("", [Validators.required, this.sexeValidator()]),
      age: new FormControl("", [Validators.required, this.ageValidator()]),
      distanceGroup: new FormGroup({
        distance: new FormControl("", [this.distanceValidator()]),
        estimationDistance: new FormControl("", [
          this.estimationDistanceValidator()
        ])
      }),
      regroupement: new FormControl("", [this.regroupementValidator()]),
      comportementsGroup: new FormGroup({
        comportement1: new FormControl("", [this.comportementValidator()]),
        comportement2: new FormControl("", [this.comportementValidator()]),
        comportement3: new FormControl("", [this.comportementValidator()]),
        comportement4: new FormControl("", [this.comportementValidator()]),
        comportement5: new FormControl("", [this.comportementValidator()]),
        comportement6: new FormControl("", [this.comportementValidator()])
      }),
      milieuxGroup: new FormGroup({
        milieu1: new FormControl("", [this.milieuValidator()]),
        milieu2: new FormControl("", [this.milieuValidator()]),
        milieu3: new FormControl("", [this.milieuValidator()]),
        milieu4: new FormControl("", [this.milieuValidator()])
      }),
      commentaire: new FormControl("", [this.commentaireValidator()])
    });
  }

  public static updateFormState = (
    form: FormGroup,
    toEnable: boolean
  ): void => {
    if (toEnable) {
      form.enable();

      const nombreFormGroup: FormGroup = form.controls.nombreGroup as FormGroup;
      if (
        nombreFormGroup.controls.estimationNombre.value &&
        nombreFormGroup.controls.estimationNombre.value.nonCompte
      ) {
        nombreFormGroup.controls.nombre.disable();
      }
    } else {
      form.disable();
    }
  };

  /**
   * Initialize the donnee form
   * Reset the form and set defaults values if any
   */
  public static initializeDonneeForm(
    donneeForm: FormGroup,
    pageModel: CreationPage
  ): void {
    const defaultAge: Age = ListHelper.findEntityInListByID(
      pageModel.ages,
      pageModel.defaultAgeId
    ) as Age;

    const defaultSexe: Sexe = ListHelper.findEntityInListByID(
      pageModel.sexes,
      pageModel.defaultSexeId
    ) as Sexe;

    const defaultEstimationNombre: EstimationNombre = ListHelper.findEntityInListByID(
      pageModel.estimationsNombre,
      pageModel.defaultEstimationNombreId
    ) as EstimationNombre;

    let defaultNombre: number = null;
    if (
      pageModel.defaultNombre &&
      (!defaultEstimationNombre ||
        (defaultEstimationNombre && !defaultEstimationNombre.nonCompte))
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

    const espece: Espece = especeFormControls.espece.value;
    const estimationNombre: EstimationNombre =
      nombreFormControls.estimationNombre.value;
    const sexe: Sexe = donneeFormControls.sexe.value;
    const age: Age = donneeFormControls.age.value;
    const estimationDistance = distanceFormControls.estimationDistance.value;

    const donnee: Donnee = {
      id: this.displayedDonneeId,
      inventaireId: InventaireHelper.getDisplayedInventaireId(),
      especeId: espece ? espece.id : null,
      nombre: nombreFormControls.nombre.value,
      estimationNombreId: estimationNombre ? estimationNombre.id : null,
      sexeId: sexe ? sexe.id : null,
      ageId: age ? age.id : null,
      distance: distanceFormControls.distance.value,
      estimationDistanceId: estimationDistance ? estimationDistance.id : null,
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
    pageModel: CreationPage,
    classeToDisplay?: Classe
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

    const espece: Espece = ListHelper.findEntityInListByID(
      pageModel.especes,
      donnee.especeId
    ) as Espece;

    const classe: Classe =
      !!espece && espece.classeId
        ? (ListHelper.findEntityInListByID(
            pageModel.classes,
            espece.classeId
          ) as Classe)
        : classeToDisplay
        ? classeToDisplay
        : null;

    const estimationNombre: EstimationNombre = ListHelper.findEntityInListByID(
      pageModel.estimationsNombre,
      donnee.estimationNombreId
    ) as EstimationNombre;

    const estimationDistance: EstimationDistance = ListHelper.findEntityInListByID(
      pageModel.estimationsDistance,
      donnee.estimationDistanceId
    ) as EstimationDistance;

    const sexe: Sexe = ListHelper.findEntityInListByID(
      pageModel.sexes,
      donnee.sexeId
    ) as Sexe;

    const age: EstimationDistance = ListHelper.findEntityInListByID(
      pageModel.ages,
      donnee.ageId
    ) as Age;

    especeFormControls.classe.setValue(classe);
    especeFormControls.espece.setValue(espece);
    nombreFormControls.nombre.setValue(donnee.nombre);
    nombreFormControls.estimationNombre.setValue(estimationNombre);
    if (!!estimationNombre && !!estimationNombre.nonCompte) {
      nombreFormControls.nombre.disable();
    }
    donneeFormControls.sexe.setValue(sexe);
    donneeFormControls.age.setValue(age);
    distanceFormControls.distance.setValue(donnee.distance);
    distanceFormControls.estimationDistance.setValue(estimationDistance);
    donneeFormControls.regroupement.setValue(donnee.regroupement);

    if (donnee.comportementsIds) {
      comportementsFormControls.comportement1.setValue(
        this.getComportement(
          pageModel.comportements,
          donnee.comportementsIds,
          1
        )
      );
      comportementsFormControls.comportement2.setValue(
        this.getComportement(
          pageModel.comportements,
          donnee.comportementsIds,
          2
        )
      );
      comportementsFormControls.comportement3.setValue(
        this.getComportement(
          pageModel.comportements,
          donnee.comportementsIds,
          3
        )
      );
      comportementsFormControls.comportement4.setValue(
        this.getComportement(
          pageModel.comportements,
          donnee.comportementsIds,
          4
        )
      );
      comportementsFormControls.comportement5.setValue(
        this.getComportement(
          pageModel.comportements,
          donnee.comportementsIds,
          5
        )
      );
      comportementsFormControls.comportement6.setValue(
        this.getComportement(
          pageModel.comportements,
          donnee.comportementsIds,
          6
        )
      );
    }
    if (donnee.milieuxIds) {
      milieuxFormControls.milieu1.setValue(
        this.getMilieu(pageModel.milieux, donnee.milieuxIds, 1)
      );
      milieuxFormControls.milieu2.setValue(
        this.getMilieu(pageModel.milieux, donnee.milieuxIds, 2)
      );
      milieuxFormControls.milieu3.setValue(
        this.getMilieu(pageModel.milieux, donnee.milieuxIds, 3)
      );
      milieuxFormControls.milieu4.setValue(
        this.getMilieu(pageModel.milieux, donnee.milieuxIds, 4)
      );
    }
    donneeFormControls.commentaire.setValue(donnee.commentaire);
  }

  /**
   * Add the id to the list of ids if this id is not already part of the list
   * @param ids list to complete
   * @param id id to add
   */
  private static addId(ids: number[], id: number): void {
    if (!!id && !ids.includes(id)) {
      ids.push(id);
    }
  }

  /**
   * Get the entity stored at index of a list if it exists
   * @param entitesCodeEtLibelle list of entities
   * @param index index of the entity to return
   */
  private static getEntiteCodeEtLibelle(
    entities: EntiteAvecLibelleEtCode[],
    ids: number[],
    index: number
  ): EntiteAvecLibelleEtCode {
    const id: number =
      ids.length >= index && !!ids[index - 1] ? ids[index - 1] : null;

    return ListHelper.findEntityInListByID(
      entities,
      id
    ) as EntiteAvecLibelleEtCode;
  }

  /**
   * Returns the comportement at specified index if it exists
   * @param comportements list of comportements
   * @param index index of the comportement to return
   */
  private static getComportement(
    allComportements: Comportement[],
    comportementsIds: number[],
    index: number
  ): Comportement {
    return this.getEntiteCodeEtLibelle(
      allComportements,
      comportementsIds,
      index
    );
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
  private static getMilieu(
    allMilieux: Milieu[],
    milieuxIds: number[],
    index: number
  ): Milieu {
    return this.getEntiteCodeEtLibelle(allMilieux, milieuxIds, index);
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

  private static classeValidator(): ValidatorFn {
    return FormValidatorHelper.isAnExistingEntityValidator();
  }

  private static especeValidator(): ValidatorFn {
    return FormValidatorHelper.isAnExistingEntityValidator();
  }

  private static nombreValidator(): ValidatorFn {
    return FormValidatorHelper.isAnIntegerValidator(1, 65535);
  }

  private static estimationNombreValidator(): ValidatorFn {
    return FormValidatorHelper.isAnExistingEntityValidator();
  }

  private static sexeValidator(): ValidatorFn {
    return FormValidatorHelper.isAnExistingEntityValidator();
  }

  private static ageValidator(): ValidatorFn {
    return FormValidatorHelper.isAnExistingEntityValidator();
  }

  private static distanceValidator(): ValidatorFn {
    return FormValidatorHelper.isAnIntegerValidator(0, 65535);
  }

  private static estimationDistanceValidator(): ValidatorFn {
    return FormValidatorHelper.isAnExistingEntityValidator();
  }

  private static regroupementValidator(): ValidatorFn {
    return FormValidatorHelper.isAnIntegerValidator(1, 65535);
  }

  private static comportementValidator(): ValidatorFn {
    return FormValidatorHelper.isAnExistingEntityValidator();
  }

  private static milieuValidator(): ValidatorFn {
    return FormValidatorHelper.isAnExistingEntityValidator();
  }

  private static commentaireValidator(): ValidatorFn {
    return FormValidatorHelper.emptyValidator();
  }
}
