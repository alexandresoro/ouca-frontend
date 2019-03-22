import { AbstractControl, FormGroup } from "@angular/forms";
import { Inventaire } from "basenaturaliste-model/inventaire.object";
import { Lieudit } from "basenaturaliste-model/lieudit.object";
import { Meteo } from "basenaturaliste-model/meteo.object";
import { Observateur } from "basenaturaliste-model/observateur.object";

export class InventaireHelper {
  public getInventaireFromInventaireFormGroup(
    inventaireForm: FormGroup,
    displayedInventaireId: number
  ): Inventaire {
    const inventaireFormControls = inventaireForm.controls;
    const lieuditFormControls = (inventaireFormControls.lieu as FormGroup)
      .controls;

    const observateur: Observateur = inventaireFormControls.observateur.value;
    if (!this.isObservateurValid(observateur)) {
      return null;
    }

    const associes: Observateur[] =
      inventaireFormControls.observateursAssocies.value;

    const date: Date = inventaireFormControls.date.value.toDate();

    const heure: string = inventaireFormControls.heure.value;

    const duree: string = inventaireFormControls.duree.value;

    const lieudit: Lieudit = lieuditFormControls.lieudit.value;

    const altitude: number = lieuditFormControls.altitude.value;

    const longitude: number = lieuditFormControls.longitude.value;

    const latitude: number = lieuditFormControls.latitude.value;

    const temperature: number = inventaireFormControls.temperature.value;

    const meteos: Meteo[] = inventaireFormControls.meteos.value;

    const inventaire: Inventaire = {
      id: displayedInventaireId,
      observateurId: observateur.id,
      associes,
      date,
      heure,
      duree,
      lieuditId: lieudit.id,
      altitude: lieuditFormControls.altitude.value,
      longitude: lieuditFormControls.longitude.value,
      latitude: lieuditFormControls.latitude.value,
      temperature: inventaireFormControls.temperature.value,
      meteos: inventaireFormControls.meteos.value
    };

    if (
      !this.areCoordinatesCustomized(
        inventaire.lieudit,
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

  private areCoordinatesCustomized(
    lieudit: Lieudit,
    altitude: number,
    longitude: number,
    latitude: number
  ): boolean {
    return (
      altitude !== lieudit.altitude ||
      longitude !== lieudit.longitude ||
      latitude !== lieudit.latitude
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

  private isObservateurValid(observateur: Observateur) {
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
