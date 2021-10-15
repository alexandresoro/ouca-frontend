import { Injectable } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from "@angular/forms";
import { Apollo, gql } from "apollo-angular";
import { set } from "date-fns";
import { map } from "rxjs/operators";
import { areCoordinatesCustomized, getCoordinates } from '../model/coordinates-system/coordinates-helper';
import { CoordinatesSystemType } from '../model/coordinates-system/coordinates-system.object';
import { LieuDit, Meteo, Observateur, Settings } from "../model/graphql";
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

type FindInventaireDataQueryResult = {
  observateur: Observateur | null
  observateursAssocies: Observateur[],
  lieuDit: LieuDit,
  meteos: Meteo[]
}

type FindInventaireDataQueryParams = {
  observateurId: number
  associesIds: number[]
  lieuDitId: number
  meteosIds: number[]
}

const FIND_INVENTAIRE_DATA_QUERY = gql`
query FindInventaireData($observateurId: Int!, $associesIds: [Int!]!, $meteosIds: [Int!]!, $lieuDitId: Int!) {
  observateur(id: $observateurId) {
    id
    libelle
  }
  observateursAssocies: observateurList(ids: $associesIds) {
    id
    libelle
  }
  lieuDit(id: $lieuDitId) {
    id
    nom
    altitude
    longitude
    latitude
    coordinatesSystem
    commune {
      id
      code
      nom
      departement {
        id
        code
      }
    }
  }
  meteos: meteoList(ids: $meteosIds) {
    id
    libelle
  }
}
`;

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
    inventaire: Inventaire | InventaireFormObject
  ): Promise<void> => {

    console.log("Affichage de l'inventaire dans le formulaire.", inventaire);

    const inventaireSettingsData = await this.apollo.query<InventaireSettingsQueryResult>({
      query: INVENTAIRE_SETTINGS_QUERY
    }).pipe(
      map(({ data }) => data?.settings)
    ).toPromise();

    this.coordinatesService.setCoordinatesSystemType(inventaireSettingsData?.coordinatesSystem);

    if (!inventaire) {
      const defaultOptions = this.getDefaultOptions(inventaireSettingsData);

      this.coordinatesService.setAreCoordinatesInvalid(false);
      this.coordinatesService.setAreCoordinatesTransformed(false);

      form.reset(defaultOptions);
    } else {
      const findInventaireData = await this.apollo.query<FindInventaireDataQueryResult, FindInventaireDataQueryParams>({
        query: FIND_INVENTAIRE_DATA_QUERY,
        variables: {
          observateurId: inventaire?.observateurId,
          associesIds: inventaire?.associesIds,
          lieuDitId: inventaire?.lieuditId,
          meteosIds: inventaire?.meteosIds
        }
      }).pipe(
        map(({ data }) => data)
      ).toPromise();

      const inventaireFormValue = this.getInventaireFormValue(
        findInventaireData,
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

  private getInventaireFormValue = (
    inventaireData: FindInventaireDataQueryResult,
    inventaire: Inventaire | InventaireFormObject,
    coordinatesSystemType: CoordinatesSystemType
  ): InventaireFormValue => {

    // TODO check weird case because of InventaireFormObject?

    let altitude: number = null;
    let coordinates: Coordinates = {
      longitude: null,
      latitude: null,
      system: coordinatesSystemType
    };

    if (inventaireData?.lieuDit?.id) {
      if (inventaire.customizedAltitude == null) {
        // Coordinates are not updated for the inventaire
        // We display the lieudit coordinates
        altitude = inventaireData?.lieuDit.altitude;
        coordinates = getCoordinates({
          coordinates: {
            latitude: inventaireData?.lieuDit.latitude,
            longitude: inventaireData?.lieuDit.longitude,
            system: inventaireData?.lieuDit.coordinatesSystem
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

    return {
      ...inventaireData,
      id: inventaire.id,
      date: interpretDateTimestampAsBrowserDate(inventaire.date),
      heure: inventaire.heure,
      duree: inventaire.duree,
      lieu: {
        departement: inventaireData?.lieuDit?.commune?.departement,
        commune: inventaireData?.lieuDit?.commune,
        lieudit: inventaireData?.lieuDit,
        altitude,
        longitude: coordinates.longitude,
        latitude: coordinates.latitude
      },
      temperature: inventaire.temperature,
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
