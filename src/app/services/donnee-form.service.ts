import { Injectable } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { Age } from "ouca-common/age.object";
import { AppConfiguration } from "ouca-common/app-configuration.object";
import { Classe } from "ouca-common/classe.object";
import { Comportement } from "ouca-common/comportement.object";
import { Donnee } from "ouca-common/donnee.object";
import { EntiteAvecLibelleEtCode } from "ouca-common/entite-avec-libelle-et-code.object";
import { Espece } from "ouca-common/espece.object";
import { EstimationDistance } from "ouca-common/estimation-distance.object";
import { EstimationNombre } from "ouca-common/estimation-nombre.object";
import { Milieu } from "ouca-common/milieu.object";
import { Sexe } from "ouca-common/sexe.object";
import { DonneeFormObject } from "../modules/donnee-creation/models/donnee-form-object.model";
import { InventaireFormObject } from "../modules/donnee-creation/models/inventaire-form-object.model";
import { FormValidatorHelper } from "../modules/shared/helpers/form-validator.helper";
import { ListHelper } from "../modules/shared/helpers/list-helper";

interface DefaultDonneeOptions {
  age: Age | null;
  sexe: Sexe | null;

  nombreGroup: {
    nombre: number | null;
    estimationNombre: EstimationNombre | null;
  };
}

@Injectable({
  providedIn: "root",
})
export class DonneeFormService {
  public createForm = (): FormGroup => {
    const form = new FormGroup({
      id: new FormControl(),
      especeGroup: new FormGroup({
        classe: new FormControl("", [this.classeValidator()]),
        espece: new FormControl("", [
          Validators.required,
          this.especeValidator(),
        ]),
      }),
      nombreGroup: new FormGroup({
        nombre: new FormControl("", [
          Validators.required,
          this.nombreValidator(),
        ]),
        estimationNombre: new FormControl("", [
          Validators.required,
          this.estimationNombreValidator(),
        ]),
      }),
      sexe: new FormControl("", [Validators.required, this.sexeValidator()]),
      age: new FormControl("", [Validators.required, this.ageValidator()]),
      distanceGroup: new FormGroup({
        distance: new FormControl("", [this.distanceValidator()]),
        estimationDistance: new FormControl("", [
          this.estimationDistanceValidator(),
        ]),
      }),
      regroupement: new FormControl("", [this.regroupementValidator()]),
      comportementsGroup: new FormGroup({
        comportement1: new FormControl("", [this.comportementValidator()]),
        comportement2: new FormControl("", [this.comportementValidator()]),
        comportement3: new FormControl("", [this.comportementValidator()]),
        comportement4: new FormControl("", [this.comportementValidator()]),
        comportement5: new FormControl("", [this.comportementValidator()]),
        comportement6: new FormControl("", [this.comportementValidator()]),
      }),
      milieuxGroup: new FormGroup({
        milieu1: new FormControl("", [this.milieuValidator()]),
        milieu2: new FormControl("", [this.milieuValidator()]),
        milieu3: new FormControl("", [this.milieuValidator()]),
        milieu4: new FormControl("", [this.milieuValidator()]),
      }),
      commentaire: new FormControl("", [this.commentaireValidator()]),
    });

    form.disable();
    return form;
  };

  /**
   * Initialize the donnee form
   * Reset the form and set defaults values if any
   */
  private initializeForm = (
    form: FormGroup,
    entities: {
      ages: Age[];
      sexes: Sexe[];
      estimationsNombre: EstimationNombre[];
    },
    appConfiguration: AppConfiguration
  ): void => {
    const defaultOptions = this.getDefaultOptions(entities, appConfiguration);
    form.reset(defaultOptions);
  };

  private getDefaultOptions = (
    entities: {
      ages: Age[];
      sexes: Sexe[];
      estimationsNombre: EstimationNombre[];
    },
    appConfiguration: AppConfiguration
  ): DefaultDonneeOptions => {
    const defaultAge: Age = ListHelper.findEntityInListByID(
      entities.ages,
      appConfiguration?.defaultAge?.id
    );

    const defaultSexe: Sexe = ListHelper.findEntityInListByID(
      entities.sexes,
      appConfiguration?.defaultSexe?.id
    );

    const defaultEstimationNombre: EstimationNombre = ListHelper.findEntityInListByID(
      entities.estimationsNombre,
      appConfiguration?.defaultEstimationNombre?.id
    );

    let defaultNombre: number = null;
    if (
      appConfiguration?.defaultNombre &&
      (!defaultEstimationNombre ||
        (defaultEstimationNombre && !defaultEstimationNombre.nonCompte))
    ) {
      defaultNombre = appConfiguration.defaultNombre;
    }

    return {
      nombreGroup: {
        nombre: defaultNombre,
        estimationNombre: defaultEstimationNombre,
      },
      sexe: defaultSexe,
      age: defaultAge,
    };
  };

  /**
   * Returns a donnee object from the values filled in donnee form
   */
  public getDonneeFromForm = (form: FormGroup): Donnee => {
    const donneeFormControls = form.controls;
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
    //_.uniq(_.map(donneeFormControls.comportementsGroup.value as {[key: string]: Comportement}, (value) => value.id))
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

    const id: number = donneeFormControls.id.value;
    const espece: Espece = especeFormControls.espece.value;
    const estimationNombre: EstimationNombre =
      nombreFormControls.estimationNombre.value;
    const sexe: Sexe = donneeFormControls.sexe.value;
    const age: Age = donneeFormControls.age.value;
    const estimationDistance = distanceFormControls.estimationDistance.value;

    const donnee: Donnee = {
      id,
      inventaireId: null,
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
      commentaire: donneeFormControls.commentaire.value,
    };

    console.log("Donnée générée depuis le formulaire:", donnee);

    return donnee;
  };

  /**
   * Fill the donnee form with the values of an existing donnee
   */
  public updateForm = (
    form: FormGroup,
    entities: {
      classes: Classe[];
      especes: Espece[];
      ages: Age[];
      sexes: Sexe[];
      estimationsNombre: EstimationNombre[];
      estimationsDistance: EstimationDistance[];
      comportements: Comportement[];
      milieux: Milieu[];
    },
    appConfiguration: AppConfiguration,
    donnee: Donnee | DonneeFormObject
  ): void => {
    if (!entities) {
      return;
    }

    console.log("Donnée à afficher dans le formulaire:", donnee);

    if (!donnee) {
      this.initializeForm(form, entities, appConfiguration);
    } else {
      const donneeFormControls = form.controls;
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
        entities.especes,
        donnee.especeId
      );

      const classe: Classe = espece?.classeId
        ? ListHelper.findEntityInListByID(entities.classes, espece.classeId)
        : (donnee as DonneeFormObject).classe;

      const estimationNombre: EstimationNombre = ListHelper.findEntityInListByID(
        entities.estimationsNombre,
        donnee.estimationNombreId
      );

      const estimationDistance: EstimationDistance = ListHelper.findEntityInListByID(
        entities.estimationsDistance,
        donnee.estimationDistanceId
      );

      const sexe: Sexe = ListHelper.findEntityInListByID(
        entities.sexes,
        donnee.sexeId
      );

      const age: EstimationDistance = ListHelper.findEntityInListByID(
        entities.ages,
        donnee.ageId
      );

      donneeFormControls.id.setValue(donnee.id);
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
            entities.comportements,
            donnee.comportementsIds,
            1
          )
        );
        comportementsFormControls.comportement2.setValue(
          this.getComportement(
            entities.comportements,
            donnee.comportementsIds,
            2
          )
        );
        comportementsFormControls.comportement3.setValue(
          this.getComportement(
            entities.comportements,
            donnee.comportementsIds,
            3
          )
        );
        comportementsFormControls.comportement4.setValue(
          this.getComportement(
            entities.comportements,
            donnee.comportementsIds,
            4
          )
        );
        comportementsFormControls.comportement5.setValue(
          this.getComportement(
            entities.comportements,
            donnee.comportementsIds,
            5
          )
        );
        comportementsFormControls.comportement6.setValue(
          this.getComportement(
            entities.comportements,
            donnee.comportementsIds,
            6
          )
        );
      }
      if (donnee.milieuxIds) {
        milieuxFormControls.milieu1.setValue(
          this.getMilieu(entities.milieux, donnee.milieuxIds, 1)
        );
        milieuxFormControls.milieu2.setValue(
          this.getMilieu(entities.milieux, donnee.milieuxIds, 2)
        );
        milieuxFormControls.milieu3.setValue(
          this.getMilieu(entities.milieux, donnee.milieuxIds, 3)
        );
        milieuxFormControls.milieu4.setValue(
          this.getMilieu(entities.milieux, donnee.milieuxIds, 4)
        );
      }
      donneeFormControls.commentaire.setValue(donnee.commentaire);
    }
  };

  public getDonneeFormObject = (
    form: FormGroup,
    inventaireFormObject: InventaireFormObject
  ): DonneeFormObject => {
    const donnee = this.getDonneeFromForm(form);

    const { ...donneeAttributes } = donnee;

    const especeFormGroup = form.controls.especeGroup as FormGroup;

    return {
      ...donneeAttributes,
      inventaire: inventaireFormObject,
      classe: especeFormGroup.controls.classe.value,
    };
  };

  /**
   * Returns the comportement at specified index if it exists
   * @param comportements list of comportements
   * @param index index of the comportement to return
   */
  private getComportement = (
    allComportements: Comportement[],
    comportementsIds: number[],
    index: number
  ): Comportement => {
    return this.getEntiteCodeEtLibelle(
      allComportements,
      comportementsIds,
      index
    );
  };

  /**
   * Add a comportement to the list of comportements if not already in the list
   * @param comportements list of comportements
   * @param comportement comportement to add in the list
   */
  private addComportement = (
    comportementsIds: number[],
    comportement: Comportement
  ): void => {
    if (!!comportement && !!comportement.id) {
      this.addId(comportementsIds, comportement.id);
    }
  };

  /**
   * Returns the milieu at specified index if it exists
   * @param milieux list of milieux
   * @param index index of the milieu to return
   */
  private getMilieu = (
    allMilieux: Milieu[],
    milieuxIds: number[],
    index: number
  ): Milieu => {
    return this.getEntiteCodeEtLibelle(allMilieux, milieuxIds, index);
  };

  /**
   * Add a milieu to the list of milieux if not already in the list
   * @param milieux list of milieux
   * @param milieu milieu to add in the list
   */
  private addMilieu = (milieuxIds: number[], milieu: Milieu): void => {
    if (!!milieu && !!milieu.id) {
      this.addId(milieuxIds, milieu.id);
    }
  };

  /**
   * Get the entity stored at index of a list if it exists
   * @param entitesCodeEtLibelle list of entities
   * @param index index of the entity to return
   */
  private getEntiteCodeEtLibelle = (
    entities: EntiteAvecLibelleEtCode[],
    ids: number[],
    index: number
  ): EntiteAvecLibelleEtCode => {
    const id: number =
      ids.length >= index && !!ids[index - 1] ? ids[index - 1] : null;

    return ListHelper.findEntityInListByID(entities, id);
  };

  /**
   * Add the id to the list of ids if this id is not already part of the list
   * @param ids list to complete
   * @param id id to add
   */
  private addId = (ids: number[], id: number): void => {
    if (!!id && !ids.includes(id)) {
      ids.push(id);
    }
  };

  private classeValidator = (): ValidatorFn => {
    return FormValidatorHelper.isAnExistingEntityValidator();
  };

  private especeValidator = (): ValidatorFn => {
    return FormValidatorHelper.isAnExistingEntityValidator();
  };

  private nombreValidator = (): ValidatorFn => {
    return FormValidatorHelper.isAnIntegerValidator(1, 65535);
  };

  private estimationNombreValidator = (): ValidatorFn => {
    return FormValidatorHelper.isAnExistingEntityValidator();
  };

  private sexeValidator = (): ValidatorFn => {
    return FormValidatorHelper.isAnExistingEntityValidator();
  };

  private ageValidator = (): ValidatorFn => {
    return FormValidatorHelper.isAnExistingEntityValidator();
  };

  private distanceValidator = (): ValidatorFn => {
    return FormValidatorHelper.isAnIntegerValidator(0, 65535);
  };

  private estimationDistanceValidator = (): ValidatorFn => {
    return FormValidatorHelper.isAnExistingEntityValidator();
  };

  private regroupementValidator = (): ValidatorFn => {
    return FormValidatorHelper.isAnIntegerValidator(1, 65535);
  };

  private comportementValidator = (): ValidatorFn => {
    return FormValidatorHelper.isAnExistingEntityValidator();
  };

  private milieuValidator = (): ValidatorFn => {
    return FormValidatorHelper.isAnExistingEntityValidator();
  };

  private commentaireValidator = (): ValidatorFn => {
    return FormValidatorHelper.emptyValidator();
  };
}
