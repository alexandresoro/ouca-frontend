import { Injectable } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from "@angular/forms";
import { Apollo, gql } from "apollo-angular";
import { map } from "rxjs/operators";
import { Comportement, Donnee, Espece, Milieu, Settings } from "../model/graphql";
import { Donnee as DonneeOld } from '../model/types/donnee.object';
import { DonneeCachedObject, InventaireCachedObject } from "../modules/donnee-creation/models/cached-object";
import { DefaultDonneeOptions } from "../modules/donnee-creation/models/default-donnee-options.model";
import { DonneeFormValue } from "../modules/donnee-creation/models/donnee-form-value.model";
import { FormValidatorHelper } from "../modules/shared/helpers/form-validator.helper";

type DonneeSettings = Pick<Settings, 'id' | 'defaultEstimationNombre' | 'defaultNombre' | 'defaultSexe' | 'defaultAge'>;
type DonneeSettingsQueryResult = {
  settings: DonneeSettings
}

const DONNEE_SETTINGS_QUERY = gql`
query DonneeSettings {
  settings {
    id
    defaultEstimationNombre {
      id
      libelle
      nonCompte
    }
    defaultSexe {
      id
      libelle
    }
    defaultAge {
      id
      libelle
    }
    defaultNombre
  }
}
`;

@Injectable({
  providedIn: "root"
})
export class DonneeFormService {

  constructor(
    private apollo: Apollo
  ) { }

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
  public updateForm = async (
    form: FormGroup,
    donnee: Donnee | DonneeCachedObject
  ): Promise<void> => {

    console.log("Affichage de la donnée dans le formulaire.", donnee);

    if (!donnee || (donnee as DonneeCachedObject)?.isDonneeEmpty) {
      // Reset the default inventaire

      const donneeSettingsData = await this.apollo.query<DonneeSettingsQueryResult>({
        query: DONNEE_SETTINGS_QUERY
      }).pipe(
        map(({ data }) => data?.settings)
      ).toPromise();

      const defaultOptions = this.getDefaultOptions(donneeSettingsData);
      form.reset(defaultOptions);

    } else {
      // This is an existing donnee for which we have everything to construct the form
      // OR
      // This is donnee that has no id -> so this is the cached one

      const donneeFormValue = this.getDonneeFormFromDonneeObject(donnee);
      form.reset(donneeFormValue);

    }
  };

  private getDonneeFormFromDonneeObject = (donnee: Donnee | DonneeCachedObject): DonneeFormValue => {
    return {
      id: (donnee as Donnee)?.id ?? null,
      especeGroup: {
        classe: donnee.espece?.classe,
        espece: donnee?.espece?.id ? donnee.espece : null
      },
      age: donnee.age,
      sexe: donnee.sexe,
      nombreGroup: {
        nombre: donnee?.nombre,
        estimationNombre: donnee.estimationNombre
      },
      distanceGroup: {
        distance: donnee.distance,
        estimationDistance: donnee.estimationDistance
      },
      regroupement: donnee.regroupement,
      comportementsGroup: this.getComportementsForForm(donnee.comportements),
      milieuxGroup: this.getMilieuxForForm(donnee.milieux),
      commentaire: donnee.commentaire
    };
  };

  private getDefaultOptions = (donneeSettings: DonneeSettings): DefaultDonneeOptions => {

    const defaultEstimationNombre = donneeSettings?.defaultEstimationNombre;

    let defaultNombre: number = null;
    if (
      donneeSettings?.defaultNombre &&
      (!defaultEstimationNombre ||
        (defaultEstimationNombre && !defaultEstimationNombre.nonCompte))
    ) {
      defaultNombre = donneeSettings.defaultNombre;
    }

    return {
      nombreGroup: {
        nombre: defaultNombre,
        estimationNombre: defaultEstimationNombre
      },
      sexe: donneeSettings?.defaultSexe,
      age: donneeSettings?.defaultAge
    };
  };

  /**
   * Returns a donnee object from the values filled in donnee form
   */
  public getDonneeFromForm = (form: FormGroup): DonneeOld => {
    const donneeFormValue: DonneeFormValue = form.value;

    const donnee: DonneeOld = {
      id: donneeFormValue.id,
      inventaireId: null,
      especeId: donneeFormValue?.especeGroup?.espece?.id ?? null,
      nombre: donneeFormValue?.nombreGroup?.nombre ?? null,
      estimationNombreId:
        donneeFormValue?.nombreGroup?.estimationNombre?.id ?? null,
      sexeId: donneeFormValue.sexe?.id ?? null,
      ageId: donneeFormValue.age?.id ?? null,
      distance: donneeFormValue?.distanceGroup?.distance ?? null,
      estimationDistanceId:
        donneeFormValue?.distanceGroup?.estimationDistance?.id ?? null,
      regroupement: donneeFormValue.regroupement,
      comportementsIds: this.getComportements(donneeFormValue),
      milieuxIds: this.getMilieux(donneeFormValue),
      commentaire: donneeFormValue.commentaire
    };

    console.log("Donnée générée depuis le formulaire:", donnee);

    return donnee;
  };

  public buildCachedDonneeFromForm = (donneeFormValue: DonneeFormValue, inventaire: InventaireCachedObject): DonneeCachedObject => {

    const comportements = (donneeFormValue?.comportementsGroup != null) ? Object.values(donneeFormValue.comportementsGroup) : [];
    const milieux = (donneeFormValue?.milieuxGroup != null) ? Object.values(donneeFormValue?.milieuxGroup) : [];

    let especeStruct: Partial<Espece> | null = null;
    if (donneeFormValue?.especeGroup?.espece) {
      especeStruct = {
        ...donneeFormValue?.especeGroup?.espece,
        ...(donneeFormValue?.especeGroup?.classe ? { classe: donneeFormValue.especeGroup.classe } : {})
      };
    } else if (donneeFormValue?.especeGroup?.classe) {
      especeStruct = {
        classe: donneeFormValue?.especeGroup?.classe
      }
    }

    const donnee = {
      inventaire,
      ...((especeStruct != null) ? { espece: especeStruct } : {}),
      nombre: donneeFormValue?.nombreGroup?.nombre,
      estimationNombre: donneeFormValue?.nombreGroup?.estimationNombre,
      sexe: donneeFormValue.sexe,
      age: donneeFormValue.age,
      distance: donneeFormValue?.distanceGroup?.distance,
      estimationDistance: donneeFormValue?.distanceGroup?.estimationDistance,
      regroupement: donneeFormValue.regroupement,
      comportements,
      milieux,
      commentaire: donneeFormValue.commentaire
    };

    console.log("Donnée générée depuis le formulaire:", donnee);

    return donnee;
  };

  private getComportements = (donneeFormValue: DonneeFormValue): number[] => {
    const comportementsIds: number[] = [];
    this.addComportement(
      comportementsIds,
      donneeFormValue.comportementsGroup?.comportement1
    );
    this.addComportement(
      comportementsIds,
      donneeFormValue.comportementsGroup?.comportement2
    );
    this.addComportement(
      comportementsIds,
      donneeFormValue.comportementsGroup?.comportement3
    );
    this.addComportement(
      comportementsIds,
      donneeFormValue.comportementsGroup?.comportement4
    );
    this.addComportement(
      comportementsIds,
      donneeFormValue.comportementsGroup?.comportement5
    );
    this.addComportement(
      comportementsIds,
      donneeFormValue.comportementsGroup?.comportement6
    );
    return comportementsIds;
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
    if (comportement?.id) {
      this.addId(comportementsIds, comportement.id);
    }
  };

  private getComportementsForForm = (comportements: Comportement[]): {
    comportement1: Comportement;
    comportement2: Comportement;
    comportement3: Comportement;
    comportement4: Comportement;
    comportement5: Comportement;
    comportement6: Comportement;
  } => {
    return {
      comportement1: comportements[0],
      comportement2: comportements[1],
      comportement3: comportements[2],
      comportement4: comportements[3],
      comportement5: comportements[4],
      comportement6: comportements[5]
    };
  };

  private getMilieuxForForm = (milieux: Milieu[]): {
    milieu1: Milieu;
    milieu2: Milieu;
    milieu3: Milieu;
    milieu4: Milieu;
  } => {
    return {
      milieu1: milieux[0],
      milieu2: milieux[1],
      milieu3: milieux[2],
      milieu4: milieux[3]
    };
  };

  private getMilieux = (donneeFormValue: DonneeFormValue): number[] => {
    const milieuxIds: number[] = [];
    this.addMilieu(milieuxIds, donneeFormValue.milieuxGroup?.milieu1);
    this.addMilieu(milieuxIds, donneeFormValue.milieuxGroup?.milieu2);
    this.addMilieu(milieuxIds, donneeFormValue.milieuxGroup?.milieu3);
    this.addMilieu(milieuxIds, donneeFormValue.milieuxGroup?.milieu4);
    return milieuxIds;
  };

  /**
   * Add a milieu to the list of milieux if not already in the list
   * @param milieux list of milieux
   * @param milieu milieu to add in the list
   */
  private addMilieu = (milieuxIds: number[], milieu: Milieu): void => {
    if (milieu?.id) {
      this.addId(milieuxIds, milieu.id);
    }
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
