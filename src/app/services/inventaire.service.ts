import { Injectable } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from "@angular/forms";
import { Commune } from "ouca-common/commune.object";
import { Departement } from "ouca-common/departement.object";
import { Inventaire } from "ouca-common/inventaire.object";
import { Lieudit } from "ouca-common/lieudit.object";
import { Meteo } from "ouca-common/meteo.object";
import { Observateur } from "ouca-common/observateur.object";
import { set } from "date-fns";
import * as _ from "lodash";
import { BehaviorSubject } from "rxjs";
import { FormValidatorHelper } from "../modules/shared/helpers/form-validator.helper";
import { ListHelper } from "../modules/shared/helpers/list-helper";
import {
  interpretBrowserDateAsTimestampDate,
  interpretDateTimestampAsBrowserDate,
  TimeHelper
} from "../modules/shared/helpers/time.helper";
import { CreationPageService } from "./creation-page.service";

@Injectable({
  providedIn: "root"
})
export class InventaireService {
  private displayedInventaireId$: BehaviorSubject<number> = new BehaviorSubject<
    number
  >(null);

  constructor(private creationPageService: CreationPageService) {}

  public getDisplayedInventaireId = (): number => {
    return this.displayedInventaireId$.value;
  };

  public setDisplayedInventaireId = (inventaireId: number): void => {
    this.displayedInventaireId$.next(inventaireId);
  };

  public createInventaireForm = (): FormGroup => {
    this.displayedInventaireId$.next(null);

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
    if (
      !inventaire.customizedCoordinatesL2E ||
      (_.isNil(inventaire.customizedAltitude) &&
        _.isNil(inventaire.customizedCoordinatesL2E.longitude) &&
        _.isNil(inventaire.customizedCoordinatesL2E.latitude))
    ) {
      lieuditFormControls.altitude.setValue(lieudit ? lieudit.altitude : null);
      lieuditFormControls.longitude.setValue(
        lieudit ? lieudit.coordinatesL2E.longitude : null
      );
      lieuditFormControls.latitude.setValue(
        lieudit ? lieudit.coordinatesL2E.latitude : null
      );
    } else {
      lieuditFormControls.altitude.setValue(inventaire.customizedAltitude);
      lieuditFormControls.longitude.setValue(
        inventaire.customizedCoordinatesL2E.longitude
      );
      lieuditFormControls.latitude.setValue(
        inventaire.customizedCoordinatesL2E.latitude
      );
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

    const altitude: number = lieuditFormControls.altitude.value;

    const longitude: number = lieuditFormControls.longitude.value;

    const latitude: number = lieuditFormControls.latitude.value;

    const temperature: number = inventaireFormControls.temperature.value;

    const meteosIds: number[] = ListHelper.getIDsFromEntities(
      inventaireFormControls.meteos.value
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
      customizedCoordinatesL2E: { longitude, latitude },
      temperature,
      meteosIds
    };

    if (
      !this.areCoordinatesCustomized(
        lieudit,
        inventaire.customizedAltitude,
        inventaire.customizedCoordinatesL2E.longitude,
        inventaire.customizedCoordinatesL2E.latitude
      )
    ) {
      inventaire.customizedAltitude = null;
      inventaire.customizedCoordinatesL2E.longitude = null;
      inventaire.customizedCoordinatesL2E.latitude = null;
    }

    console.log("Inventaire généré depuis le formulaire:", inventaire);

    return inventaire;
  };

  private areCoordinatesCustomized = (
    lieudit: Lieudit,
    altitude: number,
    longitude: number,
    latitude: number
  ): boolean => {
    return (
      !!lieudit &&
      !!lieudit.coordinatesL2E &&
      (altitude !== lieudit.altitude ||
        longitude !== lieudit.coordinatesL2E.longitude ||
        latitude !== lieudit.coordinatesL2E.latitude)
    );
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
