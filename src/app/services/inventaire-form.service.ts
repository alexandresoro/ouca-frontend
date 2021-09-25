import { Injectable } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from "@angular/forms";
import { set } from "date-fns";
import { areCoordinatesCustomized, getCoordinates } from '../model/coordinates-system/coordinates-helper';
import { CoordinatesSystemType } from '../model/coordinates-system/coordinates-system.object';
import { Commune, Departement, LieuDit, Meteo, Observateur, Settings } from "../model/graphql";
import { Coordinates } from '../model/types/coordinates.object';
import { Inventaire } from '../model/types/inventaire.object';
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
import { has } from '../modules/shared/helpers/utils';
import { CoordinatesService } from "./coordinates.service";

@Injectable({
  providedIn: "root"
})
export class InventaireFormService {
  constructor(private coordinatesService: CoordinatesService) { }

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
        latitude: new FormControl()
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
      communes: Commune[]
      departements: Departement[]
      lieuxDits: LieuDit[]
      meteos: Meteo[]
      observateurs: Observateur[]
    },
    inventaire: Inventaire | InventaireFormObject,
    appConfiguration: Settings
  ): void => {
    if (!entities) {
      return;
    }

    console.log("Affichage de l'inventaire dans le formulaire.", inventaire);

    this.coordinatesService.setCoordinatesSystemType(
      appConfiguration.coordinatesSystem
    );

    if (!inventaire) {
      const defaultOptions = this.getDefaultOptions(
        {
          observateurs: entities.observateurs,
          departements: entities.departements
        },
        appConfiguration
      );

      this.coordinatesService.setAreCoordinatesInvalid(false);
      this.coordinatesService.setAreCoordinatesTransformed(false);

      form.reset(defaultOptions);
    } else {
      const inventaireFormValue = this.getInventaireFormValue(
        entities,
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
    appConfiguration: Settings
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
      communes: Commune[]
      departements: Departement[]
      lieuxDits: LieuDit[]
      meteos: Meteo[]
      observateurs: Observateur[]
    },
    inventaire: Inventaire | InventaireFormObject,
    coordinatesSystemType: CoordinatesSystemType
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
      entities.lieuxDits,
      inventaire.lieuditId
    );

    const lieuDitCommune = entities?.communes?.find(commune => commune.id === lieudit.communeId);
    const commune = lieuDitCommune ?? (inventaire as InventaireFormObject).commune;
    const departement =
      entities?.departements?.find(departement => departement.id === commune.departementId) ??
      (inventaire as InventaireFormObject).departement;

    let altitude: number = null;
    let coordinates: Coordinates = {
      longitude: null,
      latitude: null,
      system: coordinatesSystemType
    };

    if (lieudit?.id) {
      if (inventaire.customizedAltitude == null) {
        // Coordinates are not updated for the inventaire
        // We display the lieudit coordinates
        altitude = lieudit.altitude;
        coordinates = getCoordinates({
          coordinates: {
            latitude: lieudit.latitude,
            longitude: lieudit.longitude,
            system: lieudit.coordinatesSystem
          }
        }, coordinatesSystemType);
      } else {
        // Coordinates are updated for the inventaire
        // We display the inventaire coordinates
        altitude = inventaire.customizedAltitude;
        coordinates = getCoordinates(inventaire, coordinatesSystemType);
      }
    }

    this.coordinatesService.setAreCoordinatesTransformed(
      !!coordinates.areTransformed
    );
    this.coordinatesService.setAreCoordinatesInvalid(!!coordinates.areInvalid);

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
        latitude: coordinates.latitude
      },
      temperature: inventaire.temperature,
      meteos
    };
  };

  public getInventaireFromForm = (inventaireFormValue: InventaireFormValue): Inventaire => {

    const associesIds: number[] = ListHelper.getIDsFromEntities(
      inventaireFormValue.observateursAssocies
    );

    const date: Date = interpretBrowserDateAsTimestampDate(
      inventaireFormValue.date
    );

    const heure: string = TimeHelper.getFormattedTime(
      inventaireFormValue.heure
    );

    const duree: string = TimeHelper.getFormattedDuration(
      inventaireFormValue.duree
    );

    const lieudit = inventaireFormValue.lieu.lieudit;

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
      lieuditId: lieudit?.id ?? null,
      temperature: inventaireFormValue.temperature,
      meteosIds
    };

    if (has(inventaireFormValue?.lieu, "altitude")) {
      const coordinatesSystem: CoordinatesSystemType = this.coordinatesService.getCoordinatesSystemType();

      let inventaireAltitude: number = inventaireFormValue.lieu.altitude;
      let inventaireCoordinates: Coordinates = {
        longitude: inventaireFormValue.lieu.longitude,
        latitude: inventaireFormValue.lieu.latitude,
        system: coordinatesSystem
      };

      if (
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
      inventaire.customizedAltitude = inventaireAltitude;
      inventaire.coordinates = inventaireCoordinates;
    }

    console.log("Inventaire généré depuis le formulaire:", inventaire);

    return inventaire;
  };

  public getInventaireFormObject = (form: FormGroup): InventaireFormObject => {
    const inventaireFormValue: InventaireFormValue = form.value;

    const { ...inventaireAttributes } = this.getInventaireFromForm(inventaireFormValue);

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
    return FormValidatorHelper.durationValidator();
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
    return FormValidatorHelper.isAnIntegerValidator(0, 65535);
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
