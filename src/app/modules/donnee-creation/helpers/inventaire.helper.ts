import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from "@angular/forms";
import { Commune } from "basenaturaliste-model/commune.object";
import { CreationPage } from "basenaturaliste-model/creation-page.object";
import { Departement } from "basenaturaliste-model/departement.object";
import { Inventaire } from "basenaturaliste-model/inventaire.object";
import { Lieudit } from "basenaturaliste-model/lieudit.object";
import { Meteo } from "basenaturaliste-model/meteo.object";
import { Observateur } from "basenaturaliste-model/observateur.object";
import * as _ from "lodash";
import moment = require("moment");
import { FormValidatorHelper } from "../../shared/helpers/form-validator.helper";
import { ListHelper } from "../../shared/helpers/list-helper";
import {
  TimeHelper,
  interpretDateAsUTCDate
} from "../../shared/helpers/time.helper";

export class InventaireHelper {
  private static displayedInventaireId: number = null;

  public static getDisplayedInventaireId(): number {
    return this.displayedInventaireId;
  }

  public static setDisplayedInventaireId(id: number): void {
    this.displayedInventaireId = id;
  }

  public static createInventaireForm(): FormGroup {
    this.displayedInventaireId = null;

    return new FormGroup({
      observateur: new FormControl("", [
        Validators.required,
        this.observateurValidator()
      ]),
      observateursAssocies: new FormControl("", [this.associesValidator()]),
      date: new FormControl("", [Validators.required, this.dateValidator()]),
      heure: new FormControl("", [this.heureValidator()]),
      duree: new FormControl("", [this.dureeValidator()]),
      lieu: new FormGroup({
        departement: new FormControl("", [
          Validators.required,
          this.departementValidator()
        ]),
        commune: new FormControl("", [
          Validators.required,
          this.communeValidator()
        ]),
        lieudit: new FormControl("", [
          Validators.required,
          this.lieuditValidator()
        ]),
        altitude: new FormControl("", [
          Validators.required,
          this.altitudeValidator()
        ]),
        longitude: new FormControl("", [
          Validators.required,
          this.longitudeValidator()
        ]),
        latitude: new FormControl("", [
          Validators.required,
          this.latitudeValidator()
        ])
      }),
      temperature: new FormControl("", [this.temperatureValidator()]),
      meteos: new FormControl("", [this.meteosValidator()])
    });
  }

  public static updateFormState = (
    form: FormGroup,
    toEnable: boolean
  ): void => {
    if (toEnable) {
      form.enable();
    } else {
      form.disable();
    }
  };

  /**
   * Initialize the inventaire form
   * Reset the form and set defaults values if any
   */
  public static initializeInventaireForm(
    inventaireForm: FormGroup,
    pageModel: CreationPage
  ): void {
    const defaultObservateur: Observateur = ListHelper.findEntityInListByID(
      pageModel.observateurs,
      pageModel.defaultObservateurId
    ) as Observateur;

    const defaultDepartement: Departement = ListHelper.findEntityInListByID(
      pageModel.departements,
      pageModel.defaultDepartementId
    ) as Departement;

    this.displayedInventaireId = null;

    const inventaireFormControls = inventaireForm.controls;
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

    inventaireForm.markAsUntouched();
  }

  public static getInventaireFromInventaireForm(
    inventaireForm: FormGroup
  ): Inventaire {
    const inventaireFormControls = inventaireForm.controls;
    const lieuditFormControls = (inventaireFormControls.lieu as FormGroup)
      .controls;

    const observateur: Observateur = inventaireFormControls.observateur.value;

    const associesIds: number[] = ListHelper.getIDsFromEntities(
      inventaireFormControls.observateursAssocies.value
    );

    const date: Date = new Date(
      interpretDateAsUTCDate(inventaireFormControls.date.value)
    );

    const heure: string = TimeHelper.getFormattedTime(
      inventaireFormControls.heure.value
    );

    const duree: string = TimeHelper.getFormattedTime(
      inventaireFormControls.duree.value
    );

    const lieudit: Lieudit = lieuditFormControls.lieudit.value;

    const altitude: number = lieuditFormControls.altitude.value;

    const longitude: number = lieuditFormControls.longitude.value;

    const latitude: number = lieuditFormControls.latitude.value;

    const temperature: number = inventaireFormControls.temperature.value;

    const meteosIds: number[] = ListHelper.getIDsFromEntities(
      inventaireFormControls.meteos.value
    );

    const inventaire: Inventaire = {
      id: this.displayedInventaireId,
      observateurId: observateur ? observateur.id : null,
      associesIds,
      date,
      heure,
      duree,
      lieuditId: lieudit ? lieudit.id : null,
      altitude,
      longitude,
      latitude,
      temperature,
      meteosIds
    };

    if (
      !this.areCoordinatesCustomized(
        lieudit,
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
   * Fill the inventaire form with the values from an existing inventaire
   * @param inventaire Inventaire
   */
  public static setInventaireFormFromInventaire(
    inventaireForm: FormGroup,
    inventaire: Inventaire,
    pageModel: CreationPage,
    departementToDisplay?: Departement,
    communeToDisplay?: Commune
  ): void {
    console.log("Inventaire à afficher dans le formulaire:", inventaire);

    const observateur: Observateur = ListHelper.findEntityInListByID(
      pageModel.observateurs,
      inventaire.observateurId
    ) as Observateur;

    const lieudit: Lieudit = ListHelper.findEntityInListByID(
      pageModel.lieudits,
      inventaire.lieuditId
    ) as Lieudit;

    let commune: Commune = null;
    if (!!lieudit && !!lieudit.communeId) {
      commune = ListHelper.findEntityInListByID(
        pageModel.communes,
        lieudit.communeId
      ) as Commune;
    } else if (communeToDisplay) {
      commune = communeToDisplay;
    }

    let departement: Departement = null;
    if (!!commune && !!commune.departementId) {
      departement = ListHelper.findEntityInListByID(
        pageModel.departements,
        commune.departementId
      ) as Departement;
    } else if (departementToDisplay) {
      departement = departementToDisplay;
    }

    const associes: Observateur[] = ListHelper.getEntitiesFromIDs(
      pageModel.observateurs,
      inventaire.associesIds
    ) as Observateur[];

    const meteos: Meteo[] = ListHelper.getEntitiesFromIDs(
      pageModel.meteos,
      inventaire.meteosIds
    ) as Meteo[];

    this.displayedInventaireId = inventaire.id;

    const inventaireFormControls = inventaireForm.controls;
    const lieuditFormControls = (inventaireFormControls.lieu as FormGroup)
      .controls;

    inventaireFormControls.observateur.setValue(observateur);
    inventaireFormControls.observateursAssocies.setValue(associes);
    inventaireFormControls.date.setValue(moment(inventaire.date));
    inventaireFormControls.heure.setValue(inventaire.heure);
    inventaireFormControls.duree.setValue(inventaire.duree);
    lieuditFormControls.departement.setValue(departement);
    lieuditFormControls.commune.setValue(commune);
    lieuditFormControls.lieudit.setValue(lieudit);
    if (
      !!inventaire.altitude &&
      !!inventaire.longitude &&
      !!inventaire.latitude
    ) {
      lieuditFormControls.altitude.setValue(inventaire.altitude);
      lieuditFormControls.longitude.setValue(inventaire.longitude);
      lieuditFormControls.latitude.setValue(inventaire.latitude);
    } else {
      lieuditFormControls.altitude.setValue(lieudit ? lieudit.altitude : null);
      lieuditFormControls.longitude.setValue(
        lieudit ? lieudit.longitude : null
      );
      lieuditFormControls.latitude.setValue(lieudit ? lieudit.latitude : null);
    }
    inventaireFormControls.temperature.setValue(inventaire.temperature);
    inventaireFormControls.meteos.setValue(meteos);
  }

  private static areCoordinatesCustomized(
    lieudit: Lieudit,
    altitude: number,
    longitude: number,
    latitude: number
  ): boolean {
    return (
      !!lieudit &&
      (altitude !== lieudit.altitude ||
        longitude !== lieudit.longitude ||
        latitude !== lieudit.latitude)
    );
  }

  public static isInventaireUpdated(
    inventaireFromDB: Inventaire,
    inventaireFromForm: Inventaire
  ): boolean {
    if (
      inventaireFromDB.observateurId !== inventaireFromForm.observateurId ||
      !moment(inventaireFromForm.date).isSame(moment(inventaireFromDB.date)) ||
      inventaireFromDB.heure !== inventaireFromForm.heure ||
      inventaireFromDB.duree !== inventaireFromForm.duree ||
      inventaireFromDB.lieuditId !== inventaireFromForm.lieuditId ||
      inventaireFromDB.altitude !== inventaireFromForm.altitude ||
      inventaireFromDB.longitude !== inventaireFromForm.longitude ||
      inventaireFromDB.latitude !== inventaireFromForm.latitude ||
      inventaireFromDB.temperature !== inventaireFromForm.temperature ||
      !_.isEqual(
        _.sortBy(inventaireFromDB.associesIds),
        _.sortBy(inventaireFromForm.associesIds)
      ) ||
      !_.isEqual(
        _.sortBy(inventaireFromDB.meteosIds),
        _.sortBy(inventaireFromForm.meteosIds)
      )
    ) {
      return true;
    }

    return false;
  }

  /**
   * The observateur should be filled and should exist
   */
  private static observateurValidator(): ValidatorFn {
    return FormValidatorHelper.isAnExistingEntityValidator();
  }

  /**
   * The selected associes should exist
   */
  private static associesValidator(): ValidatorFn {
    return FormValidatorHelper.areExistingEntitiesValidator();
  }

  /**
   * The date should be filled and follow the format DD/MM/YYYY
   */
  private static dateValidator(): ValidatorFn {
    return FormValidatorHelper.emptyValidator();
  }

  /**
   * The heure should be empty or filled and following the format HH:MM or HHhMM
   */
  private static heureValidator(): ValidatorFn {
    return FormValidatorHelper.timeValidator();
  }

  /**
   * The durée should be empty or filled and following the format HH:MM or HHhMM
   */
  private static dureeValidator(): ValidatorFn {
    return FormValidatorHelper.timeValidator();
  }

  /**
   * The departement should be filled and should exist
   */
  private static departementValidator(): ValidatorFn {
    return FormValidatorHelper.isAnExistingEntityValidator();
  }

  /**
   * The commune should be filled and should exist
   */
  private static communeValidator(): ValidatorFn {
    return FormValidatorHelper.isAnExistingEntityValidator();
  }

  /**
   * The lieudit should be filled and should exists
   */
  private static lieuditValidator(): ValidatorFn {
    return FormValidatorHelper.isAnExistingEntityValidator();
  }

  /**
   * The altitude should be filled and should be an integer
   */
  private static altitudeValidator(): ValidatorFn {
    return this.coordinatesValidator();
  }

  /**
   * The longitude should be filled and should be an integer
   */
  private static longitudeValidator(): ValidatorFn {
    return this.coordinatesValidator();
  }

  /**
   * The latitude should be filled and should be an integer
   */
  private static latitudeValidator(): ValidatorFn {
    return this.coordinatesValidator();
  }

  /**
   * The coordinates should be integer
   */
  private static coordinatesValidator(): ValidatorFn {
    return FormValidatorHelper.isAnIntegerValidator();
  }

  /**
   * The temperature should be empty or filled and an integer
   */
  private static temperatureValidator(): ValidatorFn {
    return FormValidatorHelper.isAnIntegerValidator();
  }

  /**
   * The selected meteos should exist
   */
  private static meteosValidator(): ValidatorFn {
    return FormValidatorHelper.areExistingEntitiesValidator();
  }
}
