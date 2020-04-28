import { Injectable } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from "@angular/forms";
import { set } from "date-fns";
import * as _ from "lodash";
import { AppConfiguration } from "ouca-common/app-configuration.object";
import {
  areCoordinatesCustomized,
  CoordinatesSystemType,
  getCoordinates
} from "ouca-common/coordinates-system";
import { Coordinates } from "ouca-common/coordinates.object";
import { Departement } from "ouca-common/departement.object";
import { Inventaire } from "ouca-common/inventaire.object";
import { Lieudit } from "ouca-common/lieudit.model";
import { Meteo } from "ouca-common/meteo.object";
import { Observateur } from "ouca-common/observateur.object";
import { BehaviorSubject } from "rxjs";
import { buildLieuditFromUILieudit } from "../helpers/lieudit.helper";
import { UILieudit } from "../models/lieudit.model";
import { DefaultInventaireOptions } from "../modules/donnee-creation/models/default-inventaire-options.model";
import { InventaireFormObject } from "../modules/donnee-creation/models/inventaire-form-object.model";
import { InventaireFormValue } from "../modules/donnee-creation/models/inventaire-form-value.model";
import { FormValidatorHelper } from "../modules/shared/helpers/form-validator.helper";
import { ListHelper } from "../modules/shared/helpers/list-helper";
import {
  interpretBrowserDateAsTimestampDate,
  interpretDateTimestampAsBrowserDate,
  TimeHelper
} from "../modules/shared/helpers/time.helper";
import { AppConfigurationService } from "./app-configuration.service";
import { CoordinatesBuilderService } from "./coordinates-builder.service";

@Injectable({
  providedIn: "root"
})
export class InventaireFormService {
  private coordinatesSystem$: BehaviorSubject<
    CoordinatesSystemType
  > = new BehaviorSubject<CoordinatesSystemType>(null);

  constructor(
    private coordinatesBuilderService: CoordinatesBuilderService,
    private appConfigurationService: AppConfigurationService
  ) {
    this.appConfigurationService
      .getAppCoordinatesSystemType$()
      .subscribe(this.coordinatesSystem$);
  }

  public createForm = (): FormGroup => {
    const form = new FormGroup({
      id: new FormControl(),
      observateur: new FormControl("", [
        Validators.required,
        this.observateurValidator()
      ]),
      observateursAssocies: new FormControl("", [this.associesValidator()]),
      date: new FormControl("", [Validators.required]),
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
        longitude: new FormControl(),
        latitude: new FormControl(),
        coordinatesSystem: new FormControl(),
        areCoordinatesTransformed: new FormControl(),
        areCoordinatesInvalid: new FormControl()
      }),
      temperature: new FormControl("", [this.temperatureValidator()]),
      meteos: new FormControl("", [this.meteosValidator()])
    });

    form.disable();
    return form;
  };

  public setInventaireIdInForm = (form: FormGroup, id: number): void => {
    form.controls.id.setValue(id);
  };

  /**
   * Fill the inventaire form with the values from an existing inventaire
   * @param inventaire Inventaire
   */
  public updateForm = (
    form: FormGroup,
    entities: {
      observateurs: Observateur[];
      lieudits: UILieudit[];
      meteos: Meteo[];
    },
    departements: Departement[],
    inventaire: Inventaire | InventaireFormObject,
    appConfiguration: AppConfiguration
  ): void => {
    if (!entities) {
      return;
    }

    console.log("Affichage de l'inventaire dans le formulaire.", inventaire);

    if (!inventaire) {
      const defaultOptions = this.getDefaultOptions(
        {
          observateurs: entities.observateurs,
          departements
        },
        appConfiguration
      );
      form.reset(defaultOptions);
    } else {
      const inventaireFormValue = this.getInventaireFormValue(
        {
          observateurs: entities.observateurs,
          lieudits: entities.lieudits,
          meteos: entities.meteos
        },
        inventaire,
        appConfiguration.coordinatesSystem
      );
      form.reset(inventaireFormValue);
    }
  };

  private getDefaultOptions = (
    entities: {
      observateurs: Observateur[];
      departements: Departement[];
    },
    appConfiguration: AppConfiguration
  ): DefaultInventaireOptions => {
    const defaultObservateur: Observateur = ListHelper.findEntityInListByID(
      entities.observateurs,
      appConfiguration.defaultObservateur?.id
    );

    const defaultDepartement: Departement = ListHelper.findEntityInListByID(
      entities.departements,
      appConfiguration.defaultDepartement?.id
    );

    const today = set(new Date(), {
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0
    });

    return {
      observateur: defaultObservateur,
      observateursAssocies: [],
      date: today,
      lieu: {
        departement: defaultDepartement,
        coordinatesSystem: appConfiguration.coordinatesSystem
      },
      meteos: []
    };
  };

  private getInventaireFormValue = (
    entities: {
      observateurs: Observateur[];
      lieudits: UILieudit[];
      meteos: Meteo[];
    },
    inventaire: Inventaire | InventaireFormObject,
    coordinatesSystem: CoordinatesSystemType
  ): InventaireFormValue => {
    const observateur = ListHelper.findEntityInListByID(
      entities.observateurs,
      inventaire.observateurId
    );

    const associes = ListHelper.getEntitiesFromIDs(
      entities.observateurs,
      inventaire.associesIds
    );

    const lieudit = ListHelper.findEntityInListByID(
      entities.lieudits,
      inventaire.lieuditId
    );

    const commune =
      lieudit?.commune ?? (inventaire as InventaireFormObject).commune;
    const departement =
      lieudit?.commune?.departement ??
      (inventaire as InventaireFormObject).departement;

    let altitude: number = null;
    let coordinates: Coordinates = {
      longitude: null,
      latitude: null,
      system: coordinatesSystem
    };

    if (lieudit?.id) {
      if (_.isNil(inventaire.customizedAltitude)) {
        // Coordinates are not updated for the inventaire
        // We display the lieudit coordinates
        altitude = lieudit.altitude;
        coordinates = getCoordinates(lieudit, coordinatesSystem);
      } else {
        // Coordinates are updated for the inventaire
        // We display the inventaire coordinates
        altitude = inventaire.customizedAltitude;
        coordinates = getCoordinates(inventaire, coordinatesSystem);
      }
    }

    const meteos = ListHelper.getEntitiesFromIDs(
      entities.meteos,
      inventaire.meteosIds
    );

    return {
      id: inventaire.id,
      observateur,
      observateursAssocies: associes,
      date: interpretDateTimestampAsBrowserDate(inventaire.date),
      heure: inventaire.heure,
      duree: inventaire.duree,
      lieu: {
        departement,
        commune,
        lieudit,
        altitude,
        longitude: coordinates.longitude,
        latitude: coordinates.latitude,
        coordinatesSystem,
        areCoordinatesTransformed: !!coordinates.areTransformed,
        areCoordinatesInvalid: !!coordinates.areInvalid
      },
      temperature: inventaire.temperature,
      meteos
    };
  };

  public getInventaireFromForm = (form: FormGroup): Inventaire => {
    const inventaireFormValue: InventaireFormValue = form.value;

    const associesIds: number[] = ListHelper.getIDsFromEntities(
      inventaireFormValue.observateursAssocies
    );

    const date: Date = interpretBrowserDateAsTimestampDate(
      inventaireFormValue.date
    );

    const heure: string = TimeHelper.getFormattedTime(
      inventaireFormValue.heure
    );

    const duree: string = TimeHelper.getFormattedTime(
      inventaireFormValue.duree
    );

    const lieudit: Lieudit = buildLieuditFromUILieudit(
      inventaireFormValue.lieu.lieudit
    );

    const coordinatesSystem: CoordinatesSystemType = this.coordinatesSystem$
      .value;

    let inventaireAltitude: number = inventaireFormValue.lieu.altitude;
    let inventaireCoordinates: Coordinates = {
      longitude: inventaireFormValue.lieu.longitude,
      latitude: inventaireFormValue.lieu.latitude,
      system: coordinatesSystem
    };

    if (
      !!inventaireFormValue.lieu.areCoordinatesInvalid ||
      !areCoordinatesCustomized(
        lieudit,
        inventaireAltitude,
        inventaireCoordinates.longitude,
        inventaireCoordinates.latitude,
        coordinatesSystem
      )
    ) {
      inventaireAltitude = null;
      inventaireCoordinates = null;
    }

    const meteosIds: number[] = ListHelper.getIDsFromEntities(
      inventaireFormValue.meteos
    );

    const inventaire: Inventaire = {
      id: inventaireFormValue.id,
      observateurId: inventaireFormValue.observateur?.id
        ? inventaireFormValue.observateur.id
        : null,
      associesIds,
      date: date.toJSON(),
      heure,
      duree,
      lieuditId: lieudit?.id ? lieudit.id : null,
      customizedAltitude: inventaireAltitude,
      coordinates: inventaireCoordinates,
      temperature: inventaireFormValue.temperature,
      meteosIds
    };

    console.log("Inventaire généré depuis le formulaire:", inventaire);

    return inventaire;
  };

  public getInventaireFormObject = (form: FormGroup): InventaireFormObject => {
    const { ...inventaireAttributes } = this.getInventaireFromForm(form);

    const inventaireFormValue: InventaireFormValue = form.value;

    return {
      ...inventaireAttributes,
      departement: inventaireFormValue.lieu.departement,
      commune: inventaireFormValue.lieu.commune
    };
  };

  /**
   * The observateur should be filled and should exist
   */
  private observateurValidator = (): ValidatorFn => {
    return FormValidatorHelper.isAnExistingEntityValidator();
  };

  /**
   * The selected associes should exist
   */
  private associesValidator = (): ValidatorFn => {
    return FormValidatorHelper.areExistingEntitiesValidator();
  };

  /**
   * The heure should be empty or filled and following the format HH:MM or HHhMM
   */
  private heureValidator = (): ValidatorFn => {
    return FormValidatorHelper.timeValidator();
  };

  /**
   * The durée should be empty or filled and following the format HH:MM or HHhMM
   */
  private dureeValidator = (): ValidatorFn => {
    return FormValidatorHelper.timeValidator();
  };

  /**
   * The departement should be filled and should exist
   */
  private departementValidator = (): ValidatorFn => {
    return FormValidatorHelper.isAnExistingEntityValidator();
  };

  /**
   * The commune should be filled and should exist
   */
  private communeValidator = (): ValidatorFn => {
    return FormValidatorHelper.isAnExistingEntityValidator();
  };

  /**
   * The lieudit should be filled and should exists
   */
  private lieuditValidator = (): ValidatorFn => {
    return FormValidatorHelper.isAnExistingEntityValidator();
  };

  /**
   * The altitude should be filled and should be an integer
   */
  private altitudeValidator = (): ValidatorFn => {
    return this.coordinatesValidator(0, 65535);
  };

  /**
   * The coordinates should be integer
   */
  private coordinatesValidator = (min: number, max: number): ValidatorFn => {
    return FormValidatorHelper.isAnIntegerValidator(min, max);
  };

  /**
   * The temperature should be empty or filled and an integer
   */
  private temperatureValidator = (): ValidatorFn => {
    return FormValidatorHelper.isAnIntegerValidator(-128, 127);
  };

  /**
   * The selected meteos should exist
   */
  private meteosValidator = (): ValidatorFn => {
    return FormValidatorHelper.areExistingEntitiesValidator();
  };
}
