import { Injectable } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from "@angular/forms";
import { Apollo, gql } from "apollo-angular";
import { format, set } from "date-fns";
import { map } from "rxjs/operators";
import { areCoordinatesCustomized, getCoordinates } from '../model/coordinates-system/coordinates-helper';
import { CoordinatesSystemType } from '../model/coordinates-system/coordinates-system.object';
import { Commune, InputInventaire, Inventaire, LieuDit, Settings } from "../model/graphql";
import { Coordinates } from '../model/types/coordinates.object';
import { InventaireCachedObject } from "../modules/donnee-creation/models/cached-object";
import { DefaultInventaireOptions } from "../modules/donnee-creation/models/default-inventaire-options.model";
import { InventaireFormValue } from "../modules/donnee-creation/models/inventaire-form-value.model";
import { FormValidatorHelper } from "../modules/shared/helpers/form-validator.helper";
import {
  interpretBrowserDateAsTimestampDate,
  interpretDateTimestampAsBrowserDate,
  TimeHelper
} from "../modules/shared/helpers/time.helper";
import { has } from '../modules/shared/helpers/utils';
import { CoordinatesService } from "./coordinates.service";

type InventaireSettings = Pick<Settings, 'id' | 'coordinatesSystem' | 'defaultObservateur' | 'defaultDepartement'>;
type InventaireSettingsQueryResult = {
  settings: InventaireSettings
}

const INVENTAIRE_SETTINGS_QUERY = gql`
query InventaireSettings {
  settings {
    id
    defaultDepartement {
      id
      code
    }
    defaultObservateur {
      id
      libelle
    }
    coordinatesSystem
  }
}
`;

@Injectable({
  providedIn: "root"
})
export class InventaireFormService {
  constructor(
    private apollo: Apollo,
    private coordinatesService: CoordinatesService
  ) { }

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
  public updateForm = async (
    form: FormGroup,
    inventaire: Inventaire | InventaireCachedObject
  ): Promise<void> => {

    console.log("Affichage de l'inventaire dans le formulaire.", inventaire);

    const inventaireSettingsData = await this.apollo.query<InventaireSettingsQueryResult>({
      query: INVENTAIRE_SETTINGS_QUERY
    }).pipe(
      map(({ data }) => data?.settings)
    ).toPromise();

    this.coordinatesService.setCoordinatesSystemType(inventaireSettingsData?.coordinatesSystem);

    if (!inventaire) {
      // No inventaire at all -> default settings
      const defaultOptions = this.getDefaultOptions(inventaireSettingsData);

      this.coordinatesService.setAreCoordinatesInvalid(false);
      this.coordinatesService.setAreCoordinatesTransformed(false);

      form.reset(defaultOptions);
    } else {
      // This is an existing inventaire for which we have everything to construct the form
      // OR
      // This is inventaire that has no id -> so this is the cached one

      const inventaireFormValue = this.getInventaireFormFromInventaireObject(
        inventaire,
        inventaireSettingsData?.coordinatesSystem
      );

      form.reset(inventaireFormValue);
    }
  };

  private getDefaultOptions = (
    inventaireSettings: InventaireSettings
  ): DefaultInventaireOptions => {

    const today = set(new Date(), {
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0
    });

    return {
      observateur: inventaireSettings?.defaultObservateur,
      observateursAssocies: [],
      date: today,
      lieu: {
        departement: inventaireSettings?.defaultDepartement,
        coordinatesSystem: inventaireSettings.coordinatesSystem
      },
      meteos: []
    };
  };

  private getInventaireFormFromInventaireObject = (
    inventaire: Inventaire | InventaireCachedObject,
    coordinatesSystemType: CoordinatesSystemType
  ): InventaireFormValue => {

    let altitude: number = null;
    let coordinates: Coordinates = {
      longitude: null,
      latitude: null,
      system: coordinatesSystemType
    };

    if (inventaire?.lieuDit?.id) {
      if (inventaire.customizedCoordinates == null) {
        // Coordinates are not updated for the inventaire
        // We display the lieudit coordinates
        altitude = inventaire?.lieuDit.altitude;
        coordinates = getCoordinates({
          coordinates: {
            latitude: inventaire?.lieuDit.latitude,
            longitude: inventaire?.lieuDit.longitude,
            system: inventaire?.lieuDit.coordinatesSystem
          }
        }, coordinatesSystemType);
      } else {
        // Coordinates are updated for the inventaire
        // We display the inventaire coordinates
        altitude = inventaire.customizedCoordinates?.altitude;
        coordinates = getCoordinates({
          coordinates: {
            latitude: inventaire.customizedCoordinates.latitude,
            longitude: inventaire.customizedCoordinates.longitude,
            system: inventaire.customizedCoordinates.system
          }
        }, coordinatesSystemType);
      }
    }

    this.coordinatesService.setAreCoordinatesTransformed(!!coordinates.areTransformed);
    this.coordinatesService.setAreCoordinatesInvalid(!!coordinates.areInvalid);

    return {
      id: (inventaire as Inventaire)?.id,
      observateur: inventaire?.observateur,
      observateursAssocies: inventaire?.associes,
      date: interpretDateTimestampAsBrowserDate(inventaire.date),
      heure: inventaire.heure,
      duree: inventaire.duree,
      lieu: {
        departement: inventaire?.lieuDit?.commune?.departement,
        commune: inventaire?.lieuDit?.commune?.id ? inventaire?.lieuDit?.commune : null,
        lieudit: inventaire?.lieuDit?.id ? inventaire?.lieuDit : null,
        altitude,
        longitude: coordinates.longitude,
        latitude: coordinates.latitude
      },
      temperature: inventaire.temperature,
      meteos: inventaire?.meteos
    };
  };

  public buildInputInventaireFromForm = (inventaireFormValue: InventaireFormValue): InputInventaire & { id?: number } => {

    const {
      id,
      observateur,
      observateursAssocies: associes,
      date: dateForm,
      heure: heureForm,
      duree: dureeForm,
      lieu,
      temperature,
      meteos,
    } = inventaireFormValue;

    const date: Date = interpretBrowserDateAsTimestampDate(dateForm);
    const heure = TimeHelper.getFormattedTime(heureForm);
    const duree = TimeHelper.getFormattedDuration(dureeForm);

    const coordinatesSystem = this.coordinatesService.getCoordinatesSystemType();

    return {
      id,
      observateurId: observateur?.id,
      ...(
        has(lieu, "altitude") &&
          areCoordinatesCustomized(
            lieu?.lieudit,
            lieu?.altitude,
            lieu?.longitude,
            lieu?.latitude,
            coordinatesSystem
          ) ? {
          altitude: lieu?.altitude,
          longitude: lieu?.longitude,
          latitude: lieu?.latitude
        } : {}
      ),
      associesIds: associes?.map(associe => associe?.id),
      date: format(date, 'yyyy-MM-dd'),
      heure,
      duree,
      lieuDitId: lieu?.lieudit.id,
      temperature,
      meteosIds: meteos?.map(meteo => meteo?.id),
    }
  };

  public buildCachedInventaireFromForm = (inventaireFormValue: InventaireFormValue): InventaireCachedObject => {

    const {
      id,
      observateursAssocies: associes,
      date: dateForm,
      heure: heureForm,
      duree: dureeForm,
      lieu,
      ...restForm
    } = inventaireFormValue;

    const date: Date = interpretBrowserDateAsTimestampDate(dateForm);
    const heure: string = TimeHelper.getFormattedTime(heureForm);
    const duree: string = TimeHelper.getFormattedDuration(dureeForm);

    const coordinatesSystem = this.coordinatesService.getCoordinatesSystemType();

    const customizedCoordinates = (
      has(lieu, "altitude") &&
      areCoordinatesCustomized(
        lieu?.lieudit,
        lieu?.altitude,
        lieu?.longitude,
        lieu?.latitude,
        coordinatesSystem
      )
    )
      ? {
        customizedCoordinates: {
          altitude: lieu?.altitude,
          longitude: lieu?.longitude,
          latitude: lieu?.latitude,
          system: coordinatesSystem
        }
      }
      : {};

    let lieuDitStruct: Omit<Partial<LieuDit>, 'commune'> & { commune?: Partial<Commune> } | null = null;
    if (lieu?.lieudit && lieu?.commune) {
      lieuDitStruct = {
        ...lieu.lieudit,
        commune: {
          ...lieu.commune,
          ...(lieu?.departement ? { departement: lieu.departement } : {})
        }
      }
    } else if (lieu?.lieudit) {
      lieuDitStruct = {
        ...lieu.lieudit,
        ...(lieu?.departement ? {
          commune: {
            departement: lieu.departement
          }
        } : {})
      }
    } else if (lieu?.commune) {
      lieuDitStruct = {
        commune: {
          ...lieu.commune,
          ...(lieu?.departement ? { departement: lieu.departement } : {})
        }
      }
    } else if (lieu?.departement) {
      lieuDitStruct = {
        commune: {
          departement: lieu?.departement
        }
      }
    }

    const inventaire = {
      ...restForm,
      ...customizedCoordinates,
      associes,
      date: date.toJSON(),
      heure,
      duree,
      ...((lieuDitStruct != null) ? { lieuDit: lieuDitStruct } : {})
    }

    console.log("Inventaire généré depuis le formulaire:", inventaire);

    return inventaire;
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
