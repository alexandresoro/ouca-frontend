import {
  AbstractControl,
  FormControl,
  FormGroup,
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
      observateur: new FormControl("", [Validators.required]),
      observateursAssocies: new FormControl(""),
      date: new FormControl("", Validators.required),
      heure: new FormControl(""),
      duree: new FormControl(""),
      lieu: new FormGroup({
        departement: new FormControl("", Validators.required),
        commune: new FormControl("", Validators.required),
        lieudit: new FormControl("", Validators.required),
        altitude: new FormControl("", Validators.required),
        longitude: new FormControl("", Validators.required),
        latitude: new FormControl("", Validators.required)
      }),
      temperature: new FormControl(""),
      meteos: new FormControl("")
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

    const heure: string = inventaireFormControls.heure.value;

    const duree: string = inventaireFormControls.duree.value;

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

  public observateurValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    if (!!control.value && !!control.value.id) {
      return { isObservateurValid: true };
    }
    return null;
  }

  private static isObservateurValid(observateur: Observateur) {
    return !!observateur && !!observateur.id;
  }

  private areAssociesValid(associes: Observateur[]) {
    return true;
  }

  private isDateValid(date: Date) {
    return true;
  }

  private isHeureValid(heure: string) {
    return true;
  }

  private isDureeValid(duree: string) {
    return true;
  }

  isLieuditValid(lieudit: Lieudit) {
    return true;
  }

  isAltitudeValid(altitude: number) {
    return true;
  }

  isLongitudeValid(longitude: number) {
    return true;
  }

  isLatitudeValid(latitude: number) {
    return true;
  }

  isTemperatureValid(temperature: number) {
    return true;
  }

  areMeteosValid(meteos: Meteo[]) {
    return true;
  }
}
