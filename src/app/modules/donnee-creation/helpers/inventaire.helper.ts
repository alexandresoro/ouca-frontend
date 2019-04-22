import {
  AbstractControl,
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
import { ListHelper } from "../../shared/helpers/list-helper";

export class InventaireHelper {
  private static displayedInventaireId: number = null;

  public static getDisplayedInventaireId(): number {
    return this.displayedInventaireId;
  }

  public static setDisplayedInventaireId(id: number) {
    this.displayedInventaireId = id;
  }

  public static createInventaireForm() {
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

  /**
   * Initialize the inventaire form
   * Reset the form and set defaults values if any
   */
  public static initializeInventaireForm(
    inventaireForm: FormGroup,
    pageModel: CreationPage
  ): void {
    let defaultObservateur: Observateur = null;
    if (!!pageModel.defaultObservateurId) {
      defaultObservateur = ListHelper.getFromList(
        pageModel.observateurs,
        "id",
        pageModel.defaultObservateurId
      );
    }

    let defaultDepartement: Departement = null;
    if (!!pageModel.defaultDepartementId) {
      defaultDepartement = ListHelper.getFromList(
        pageModel.departements,
        "id",
        pageModel.defaultDepartementId
      );
    }

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

    const associesIds: number[] = ListHelper.mapEntitiesToIds(
      inventaireFormControls.observateursAssocies.value
    );

    const date: Date = inventaireFormControls.date.value.toDate();

    const heure: string = this.getFormattedTime(
      inventaireFormControls.heure.value
    );

    const duree: string = this.getFormattedTime(
      inventaireFormControls.duree.value
    );

    const lieudit: Lieudit = lieuditFormControls.lieudit.value;

    const altitude: number = lieuditFormControls.altitude.value;

    const longitude: number = lieuditFormControls.longitude.value;

    const latitude: number = lieuditFormControls.latitude.value;

    const temperature: number = inventaireFormControls.temperature.value;

    const meteosIds: number[] = ListHelper.mapEntitiesToIds(
      inventaireFormControls.meteos.value
    );

    const inventaire: Inventaire = {
      id: this.displayedInventaireId,
      observateurId: !!observateur ? observateur.id : null,
      associesIds,
      date,
      heure,
      duree,
      lieuditId: !!lieudit ? lieudit.id : null,
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

  private static getFormattedTime(timeStr: string): string {
    if (!!timeStr) {
      let value = timeStr;
      const dateRegExp1: RegExp = new RegExp("^[0-9][0-9][0-9][0-9]$");
      if (dateRegExp1.test(value)) {
        value =
          value.charAt(0) +
          value.charAt(1) +
          ":" +
          value.charAt(2) +
          value.charAt(3);
      }

      const dateRegExp2: RegExp = new RegExp("^[0-9][0-9][h][0-9][0-9]$");
      if (dateRegExp2.test(value)) {
        value = value.replace("h", ":");
      }

      const dateRegExp3: RegExp = new RegExp("^[0-9][0-9][H][0-9][0-9]$");
      if (dateRegExp3.test(value)) {
        value = value.replace("H", ":");
      }
      return value;
    }
    return null;
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

    const observateur: Observateur = ListHelper.getFromList(
      pageModel.observateurs,
      "id",
      inventaire.observateurId
    );

    const lieudit: Lieudit = ListHelper.getFromList(
      pageModel.lieudits,
      "id",
      inventaire.lieuditId
    );

    let commune: Commune = null;
    if (!!lieudit && !!lieudit.communeId) {
      commune = ListHelper.getFromList(
        pageModel.communes,
        "id",
        lieudit.communeId
      );
    } else if (!!communeToDisplay) {
      commune = communeToDisplay;
    }

    let departement: Departement = null;
    if (!!commune && !!commune.departementId) {
      departement = ListHelper.getFromList(
        pageModel.departements,
        "id",
        commune.departementId
      );
    } else if (!!departementToDisplay) {
      departement = departementToDisplay;
    }

    const associes: Observateur[] = ListHelper.mapIdsToEntities(
      pageModel.observateurs,
      inventaire.associesIds
    );

    const meteos: Meteo[] = ListHelper.mapIdsToEntities(
      pageModel.meteos,
      inventaire.meteosIds
    );

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
      lieuditFormControls.altitude.setValue(
        !!lieudit ? lieudit.altitude : null
      );
      lieuditFormControls.longitude.setValue(
        !!lieudit ? lieudit.longitude : null
      );
      lieuditFormControls.latitude.setValue(
        !!lieudit ? lieudit.latitude : null
      );
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

  /**
   * The observateur should be filled and should exist
   */
  private static observateurValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const valueIsNotAnExistingObservateur: boolean =
        !control.value || (!!control.value && !control.value.id);
      return valueIsNotAnExistingObservateur
        ? { forbiddenValue: { value: control.value } }
        : null;
    };
  }

  /**
   * The selected associes should exist
   */
  private static associesValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let oneOfTheValueIsNotAnExistingObservateur: boolean = false;
      for (const value of control.value) {
        if (!!value && !value.id) {
          oneOfTheValueIsNotAnExistingObservateur = true;
        }
      }
      return oneOfTheValueIsNotAnExistingObservateur
        ? { forbiddenValue: { value: control.value } }
        : null;
    };
  }

  /**
   * The date should be filled and follow the format DD/MM/YYYY
   */
  private static dateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return null;
    };
  }

  /**
   * The heure should be empty or filled and following the format HH:MM or HHhMM
   */
  private static heureValidator(): ValidatorFn {
    return this.timeValidator();
  }

  /**
   * The durée should be empty or filled and following the format HH:MM or HHhMM
   */
  private static dureeValidator(): ValidatorFn {
    return this.timeValidator();
  }

  /**
   * The tile should be empty or filled and following the format HH:MM or HHhMM
   */
  private static timeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = this.getFormattedTime(control.value);

      const finalDateRegExp: RegExp = new RegExp("^[0-9][0-9][:][0-9][0-9]$");
      const isNotMatchingRegExp: boolean =
        !!value && !finalDateRegExp.test(value);

      return isNotMatchingRegExp
        ? { forbiddenValue: { value: control.value } }
        : null;
    };
  }

  /**
   * The departement should be filled and should exist
   */
  private static departementValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const valueIsNotAnExistingDepartement: boolean =
        !control.value || (!!control.value && !control.value.id);
      return valueIsNotAnExistingDepartement
        ? { forbiddenValue: { value: control.value } }
        : null;
    };
  }

  /**
   * The commune should be filled and should exist
   */
  private static communeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const valueIsNotAnExistingCommune: boolean =
        !control.value || (!!control.value && !control.value.id);
      return valueIsNotAnExistingCommune
        ? { forbiddenValue: { value: control.value } }
        : null;
    };
  }

  /**
   * The lieudit should be filled and should exists
   */
  private static lieuditValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const valueIsNotAnExistingLieudit: boolean =
        !control.value || (!!control.value && !control.value.id);
      return valueIsNotAnExistingLieudit
        ? { forbiddenValue: { value: control.value } }
        : null;
    };
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
    return (control: AbstractControl): { [key: string]: any } | null => {
      const valueIsNotAnInteger: boolean = !Number.isInteger(control.value);
      return valueIsNotAnInteger
        ? { forbiddenValue: { value: control.value } }
        : null;
    };
  }

  /**
   * The temperature should be empty or filled and an integer
   */
  private static temperatureValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const valueIsNotAnInteger: boolean =
        !!control.value && !Number.isInteger(control.value);
      return valueIsNotAnInteger
        ? { forbiddenValue: { value: control.value } }
        : null;
    };
  }

  /**
   * The selected meteos should exist
   */
  private static meteosValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let oneOfTheValueIsNotAnExistingMeteo: boolean = false;
      for (const value of control.value) {
        if (!!value && !value.id) {
          oneOfTheValueIsNotAnExistingMeteo = true;
        }
      }
      return oneOfTheValueIsNotAnExistingMeteo
        ? { forbiddenValue: { value: control.value } }
        : null;
    };
  }
}
