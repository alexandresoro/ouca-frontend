import { FormGroup } from "@angular/forms";
import { Inventaire } from "basenaturaliste-model/inventaire.object";
import * as _ from "lodash";
import moment = require("moment");

export class InventaireHelper {
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
      inventaireFromDB.customizedAltitude !==
        inventaireFromForm.customizedAltitude ||
      inventaireFromDB.customizedCoordinatesL2E.longitude !==
        inventaireFromForm.customizedCoordinatesL2E.longitude ||
      inventaireFromDB.customizedCoordinatesL2E.latitude !==
        inventaireFromForm.customizedCoordinatesL2E.latitude ||
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
}
