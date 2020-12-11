import { Injectable } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from "@angular/forms";
import { Age } from "@ou-ca/ouca-model/age.object";
import { AppConfiguration } from "@ou-ca/ouca-model/app-configuration.object";
import { Classe } from "@ou-ca/ouca-model/classe.object";
import { Comportement } from "@ou-ca/ouca-model/comportement.object";
import { Donnee } from "@ou-ca/ouca-model/donnee.object";
import { EntiteAvecLibelleEtCode } from "@ou-ca/ouca-model/entite-avec-libelle-et-code.object";
import { Espece } from "@ou-ca/ouca-model/espece.model";
import { EstimationDistance } from "@ou-ca/ouca-model/estimation-distance.object";
import { EstimationNombre } from "@ou-ca/ouca-model/estimation-nombre.object";
import { Milieu } from "@ou-ca/ouca-model/milieu.object";
import { Sexe } from "@ou-ca/ouca-model/sexe.object";
import { buildEspeceFromUIEspece } from "../helpers/espece.helper";
import { UIEspece } from "../models/espece.model";
import { DefaultDonneeOptions } from "../modules/donnee-creation/models/default-donnee-options.model";
import { DonneeFormObject } from "../modules/donnee-creation/models/donnee-form-object.model";
import { DonneeFormValue } from "../modules/donnee-creation/models/donnee-form-value.model";
import { InventaireFormObject } from "../modules/donnee-creation/models/inventaire-form-object.model";
import { FormValidatorHelper } from "../modules/shared/helpers/form-validator.helper";
import { ListHelper } from "../modules/shared/helpers/list-helper";

@Injectable({
  providedIn: "root"
})
export class DonneeFormService {
  public createForm = (): FormGroup => {
    const form = new FormGroup({
      id: new FormControl(),
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
      commentaire: new FormControl("")
    });

    form.disable();
    return form;
  };

  /**
   * Fill the donnee form with the values of an existing donnee
   */
  public updateForm = (
    form: FormGroup,
    entities: {
      especes: UIEspece[];
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

    console.log("Affichage de la donnée dans le formulaire.", donnee);

    if (!donnee || (donnee as DonneeFormObject).isDonneeEmpty) {
      const defaultOptions = this.getDefaultOptions(
        {
          ages: entities.ages,
          sexes: entities.sexes,
          estimationsNombre: entities.estimationsNombre
        },
        appConfiguration
      );
      form.reset(defaultOptions);
    } else {
      const donneeFormValue = this.getDonneeFormValue(entities, donnee);
      form.reset(donneeFormValue);
    }
  };

  private getDonneeFormValue = (
    entities: {
      especes: UIEspece[];
      ages: Age[];
      sexes: Sexe[];
      estimationsNombre: EstimationNombre[];
      estimationsDistance: EstimationDistance[];
      comportements: Comportement[];
      milieux: Milieu[];
    },
    donnee: Donnee | DonneeFormObject
  ): DonneeFormValue => {
    const espece = ListHelper.findEntityInListByID(
      entities.especes,
      donnee.especeId
    );

    const classe: Classe =
      espece?.classe ?? (donnee as DonneeFormObject).classe;

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

    return {
      id: donnee.id,
      especeGroup: {
        classe,
        espece
      },
      age,
      sexe,
      nombreGroup: {
        nombre: donnee.nombre,
        estimationNombre
      },
      distanceGroup: {
        distance: donnee.distance,
        estimationDistance
      },
      regroupement: donnee.regroupement,
      comportementsGroup: this.getComportementsForForm(
        entities.comportements,
        donnee.comportementsIds
      ),
      milieuxGroup: this.getMilieuxForForm(entities.milieux, donnee.milieuxIds),
      commentaire: donnee.commentaire
    };
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
        estimationNombre: defaultEstimationNombre
      },
      sexe: defaultSexe,
      age: defaultAge
    };
  };

  /**
   * Returns a donnee object from the values filled in donnee form
   */
  public getDonneeFromForm = (form: FormGroup): Donnee => {
    const donneeFormValue: DonneeFormValue = form.value;

    const espece: Espece = buildEspeceFromUIEspece(
      donneeFormValue.especeGroup.espece
    );

    const donnee: Donnee = {
      id: donneeFormValue.id,
      inventaireId: null,
      especeId: espece?.id ?? null,
      nombre: donneeFormValue.nombreGroup.nombre,
      estimationNombreId:
        donneeFormValue.nombreGroup.estimationNombre?.id ?? null,
      sexeId: donneeFormValue.sexe?.id ?? null,
      ageId: donneeFormValue.age?.id ?? null,
      distance: donneeFormValue.distanceGroup.distance,
      estimationDistanceId:
        donneeFormValue.distanceGroup.estimationDistance?.id ?? null,
      regroupement: donneeFormValue.regroupement,
      comportementsIds: this.getComportements(donneeFormValue),
      milieuxIds: this.getMilieux(donneeFormValue),
      commentaire: donneeFormValue.commentaire
    };

    console.log("Donnée générée depuis le formulaire:", donnee);

    return donnee;
  };

  public getDonneeFormObject = (
    form: FormGroup,
    inventaireFormObject: InventaireFormObject
  ): DonneeFormObject => {
    const { ...donneeAttributes } = this.getDonneeFromForm(form);

    const donneeFormValue: DonneeFormValue = form.value;

    return {
      ...donneeAttributes,
      inventaire: inventaireFormObject,
      classe: donneeFormValue.especeGroup.classe
    };
  };

  private getComportements = (donneeFormValue: DonneeFormValue): number[] => {
    const comportementsIds: number[] = [];
    this.addComportement(
      comportementsIds,
      donneeFormValue.comportementsGroup.comportement1
    );
    this.addComportement(
      comportementsIds,
      donneeFormValue.comportementsGroup.comportement2
    );
    this.addComportement(
      comportementsIds,
      donneeFormValue.comportementsGroup.comportement3
    );
    this.addComportement(
      comportementsIds,
      donneeFormValue.comportementsGroup.comportement4
    );
    this.addComportement(
      comportementsIds,
      donneeFormValue.comportementsGroup.comportement5
    );
    this.addComportement(
      comportementsIds,
      donneeFormValue.comportementsGroup.comportement6
    );
    return comportementsIds;
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

  private getComportementsForForm = (
    comportements: Comportement[],
    comportementsIds: number[]
  ): {
    comportement1: Comportement;
    comportement2: Comportement;
    comportement3: Comportement;
    comportement4: Comportement;
    comportement5: Comportement;
    comportement6: Comportement;
  } => {
    return {
      comportement1: this.getComportement(comportements, comportementsIds, 1),
      comportement2: this.getComportement(comportements, comportementsIds, 2),
      comportement3: this.getComportement(comportements, comportementsIds, 3),
      comportement4: this.getComportement(comportements, comportementsIds, 4),
      comportement5: this.getComportement(comportements, comportementsIds, 5),
      comportement6: this.getComportement(comportements, comportementsIds, 6)
    };
  };

  private getMilieuxForForm = (
    milieux: Milieu[],
    milieuxIds: number[]
  ): {
    milieu1: Milieu;
    milieu2: Milieu;
    milieu3: Milieu;
    milieu4: Milieu;
  } => {
    return {
      milieu1: this.getMilieu(milieux, milieuxIds, 1),
      milieu2: this.getMilieu(milieux, milieuxIds, 2),
      milieu3: this.getMilieu(milieux, milieuxIds, 3),
      milieu4: this.getMilieu(milieux, milieuxIds, 4)
    };
  };

  private getMilieux = (donneeFormValue: DonneeFormValue): number[] => {
    const milieuxIds: number[] = [];
    this.addMilieu(milieuxIds, donneeFormValue.milieuxGroup.milieu1);
    this.addMilieu(milieuxIds, donneeFormValue.milieuxGroup.milieu2);
    this.addMilieu(milieuxIds, donneeFormValue.milieuxGroup.milieu3);
    this.addMilieu(milieuxIds, donneeFormValue.milieuxGroup.milieu4);
    return milieuxIds;
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
  private getEntiteCodeEtLibelle = <T extends EntiteAvecLibelleEtCode>(
    entities: T[],
    ids: number[],
    index: number
  ): T => {
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
}
