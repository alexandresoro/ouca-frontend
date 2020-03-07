import { Injectable } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from "@angular/forms";
import { set } from "date-fns";
import * as _ from "lodash";
import { Commune } from "ouca-common/commune.object";
import {
  getCoordinates,
  getOriginCoordinates,
  LAMBERT_93
} from "ouca-common/coordinates-system";
import { Coordinates } from "ouca-common/coordinates.object";
import { Departement } from "ouca-common/departement.object";
import { Inventaire } from "ouca-common/inventaire.object";
import { Lieudit } from "ouca-common/lieudit.object";
import { Meteo } from "ouca-common/meteo.object";
import { Observateur } from "ouca-common/observateur.object";
import { BehaviorSubject } from "rxjs";
import { buildCoordinates } from "../modules/shared/helpers/coordinates.helper";
import { FormValidatorHelper } from "../modules/shared/helpers/form-validator.helper";
import { ListHelper } from "../modules/shared/helpers/list-helper";
import {
  interpretBrowserDateAsTimestampDate,
  interpretDateTimestampAsBrowserDate,
  TimeHelper
} from "../modules/shared/helpers/time.helper";
import { CoordinatesService } from "./coordinates.service";
import { CreationPageService } from "./creation-page.service";

@Injectable({
  providedIn: "root"
})
export class InventaireService {
  private displayedInventaireId$: BehaviorSubject<number> = new BehaviorSubject<
    number
  >(null);

  constructor(
    private coordinatesService: CoordinatesService,
    private creationPageService: CreationPageService
  ) {}

  public getDisplayedInventaireId = (): number => {
    return this.displayedInventaireId$.value;
  };

  public setDisplayedInventaireId = (inventaireId: number): void => {
    this.displayedInventaireId$.next(inventaireId);
  };

  public createInventaireForm = (): FormGroup => {
    this.displayedInventaireId$.next(null);

    const form = new FormGroup({
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
        longitude: new FormControl(),
        latitude: new FormControl()
      }),
      temperature: new FormControl("", [this.temperatureValidator()]),
      meteos: new FormControl("", [this.meteosValidator()])
    });

    this.coordinatesService
      .getAppCoordinatesSystem$()
      .subscribe((coordinatesSystemType) => {
        this.coordinatesService.updateCoordinatesValidators(
          coordinatesSystemType,
          (form.controls.lieu as FormGroup).controls.longitude,
          (form.controls.lieu as FormGroup).controls.latitude
        );
      });

    return form;
  };

  /**
   * Initialize the inventaire form
   * Reset the form and set defaults values if any
   */
  public initializeInventaireForm = (inventaireForm: FormGroup): void => {
    const pageModel = this.creationPageService.getCreationPage();

    const defaultObservateur: Observateur = ListHelper.findEntityInListByID(
      pageModel.observateurs,
      pageModel.defaultObservateurId
    );

    const defaultDepartement: Departement = ListHelper.findEntityInListByID(
      pageModel.departements,
      pageModel.defaultDepartementId
    );

    this.displayedInventaireId$.next(null);

    const inventaireFormControls = inventaireForm.controls;
    const lieuditFormControls = (inventaireFormControls.lieu as FormGroup)
      .controls;

    inventaireFormControls.observateur.setValue(defaultObservateur);
    inventaireFormControls.observateursAssocies.setValue(
      new Array<Observateur>()
    );
    const today = set(new Date(), {
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0
    });
    inventaireFormControls.date.setValue(today);
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
  };

  /**
   * Fill the inventaire form with the values from an existing inventaire
   * @param inventaire Inventaire
   */
  public setInventaireFormFromInventaire = (
    inventaireForm: FormGroup,
    inventaire: Inventaire,
    departementToDisplay?: Departement,
    communeToDisplay?: Commune
  ): void => {
    console.log("Inventaire à afficher dans le formulaire:", inventaire);

    const pageModel = this.creationPageService.getCreationPage();

    const observateur: Observateur = ListHelper.findEntityInListByID(
      pageModel.observateurs,
      inventaire.observateurId
    );

    const lieudit: Lieudit = ListHelper.findEntityInListByID(
      pageModel.lieudits,
      inventaire.lieuditId
    );

    let commune: Commune = null;
    if (!!lieudit && !!lieudit.communeId) {
      commune = ListHelper.findEntityInListByID(
        pageModel.communes,
        lieudit.communeId
      );
    } else if (communeToDisplay) {
      commune = communeToDisplay;
    }

    let departement: Departement = null;
    if (!!commune && !!commune.departementId) {
      departement = ListHelper.findEntityInListByID(
        pageModel.departements,
        commune.departementId
      );
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

    this.displayedInventaireId$.next(inventaire.id);

    const inventaireFormControls = inventaireForm.controls;
    const lieuditFormControls = (inventaireFormControls.lieu as FormGroup)
      .controls;

    inventaireFormControls.observateur.setValue(observateur);
    inventaireFormControls.observateursAssocies.setValue(associes);
    inventaireFormControls.date.setValue(
      interpretDateTimestampAsBrowserDate(inventaire.date)
    );
    inventaireFormControls.heure.setValue(inventaire.heure);
    inventaireFormControls.duree.setValue(inventaire.duree);
    lieuditFormControls.departement.setValue(departement);
    lieuditFormControls.commune.setValue(commune);
    lieuditFormControls.lieudit.setValue(lieudit);

    const coordinatesSystem = this.coordinatesService.getAppCoordinatesSystem();
    const inventaireCoordinates: Coordinates = getCoordinates(
      inventaire,
      coordinatesSystem
    );
    const lieuditCoordinates: Coordinates = getCoordinates(
      lieudit,
      coordinatesSystem
    );

    if (lieudit && lieudit.id && _.isNil(inventaire.customizedAltitude)) {
      // Coordinates are not updated for the inventaire
      // We display the lieudit coordinates
      lieuditFormControls.altitude.setValue(lieudit.altitude);
      lieuditFormControls.longitude.setValue(lieuditCoordinates.longitude);
      lieuditFormControls.latitude.setValue(lieuditCoordinates.latitude);
    } else {
      // Coordinates are updated for the inventaire
      // We display the inventaire coordinates
      lieuditFormControls.altitude.setValue(inventaire.customizedAltitude);
      lieuditFormControls.longitude.setValue(inventaireCoordinates.longitude);
      lieuditFormControls.latitude.setValue(inventaireCoordinates.latitude);
    }

    inventaireFormControls.temperature.setValue(inventaire.temperature);
    inventaireFormControls.meteos.setValue(meteos);
  };

  public getInventaireFromInventaireForm = (
    inventaireForm: FormGroup
  ): Inventaire => {
    const inventaireFormControls = inventaireForm.controls;
    const lieuditFormControls = (inventaireFormControls.lieu as FormGroup)
      .controls;

    const observateur: Observateur = inventaireFormControls.observateur.value;

    const associesIds: number[] = ListHelper.getIDsFromEntities(
      inventaireFormControls.observateursAssocies.value
    );

    const date: Date = interpretBrowserDateAsTimestampDate(
      inventaireFormControls.date.value
    );

    const heure: string = TimeHelper.getFormattedTime(
      inventaireFormControls.heure.value
    );

    const duree: string = TimeHelper.getFormattedTime(
      inventaireFormControls.duree.value
    );

    const lieudit: Lieudit = lieuditFormControls.lieudit.value;

    let altitude: number = lieuditFormControls.altitude.value;

    let longitude: number = lieuditFormControls.longitude.value;

    let latitude: number = lieuditFormControls.latitude.value;

    const temperature: number = inventaireFormControls.temperature.value;

    const meteosIds: number[] = ListHelper.getIDsFromEntities(
      inventaireFormControls.meteos.value
    );

    if (
      !this.areCoordinatesCustomized(lieudit, altitude, longitude, latitude)
    ) {
      altitude = null;
      longitude = null;
      latitude = null;
    }

    const inventaireCoordinates = buildCoordinates(
      LAMBERT_93,
      longitude,
      latitude
    );

    const inventaire: Inventaire = {
      id: this.displayedInventaireId$.value,
      observateurId: observateur ? observateur.id : null,
      associesIds,
      date: date.toJSON(),
      heure,
      duree,
      lieuditId: lieudit ? lieudit.id : null,
      customizedAltitude: altitude,
      coordinates: inventaireCoordinates,
      temperature,
      meteosIds
    };

    console.log("Inventaire généré depuis le formulaire:", inventaire);

    return inventaire;
  };

  private areCoordinatesCustomized = (
    lieudit: Lieudit,
    altitude: number,
    longitude: number,
    latitude: number
  ): boolean => {
    if (lieudit) {
      const lieuditCoordinates: Coordinates = getOriginCoordinates(lieudit);

      if (
        lieudit.altitude !== altitude ||
        lieuditCoordinates.longitude !== longitude ||
        lieuditCoordinates.latitude !== latitude
      ) {
        return true;
      }
    }

    return false;
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
   * The date should be filled and follow the format DD/MM/YYYY
   */
  private dateValidator = (): ValidatorFn => {
    return FormValidatorHelper.emptyValidator();
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
   * The longitude should be filled and should be an integer
   */
  private longitudeValidator = (): ValidatorFn => {
    return this.coordinatesValidator(0, 16777215);
  };

  /**
   * The latitude should be filled and should be an integer
   */
  private latitudeValidator = (): ValidatorFn => {
    return this.coordinatesValidator(0, 16777215);
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
