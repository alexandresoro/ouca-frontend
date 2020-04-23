import { isSameDay } from "date-fns";
import * as _ from "lodash";
import { Coordinates } from "ouca-common/coordinates.object";
import { Inventaire } from "ouca-common/inventaire.object";
import { interpretBrowserDateAsTimestampDate } from "../../shared/helpers/time.helper";

export class InventaireHelper {
  /**
   * Method that returns true if both values represent a different number, or if only one is a number
   */
  private static areDifferentNumbers = (
    firstNumber: number | null | undefined,
    secondNumber: number | null | undefined
  ): boolean => {
    return (
      !_.isEqual(firstNumber, secondNumber) &&
      _.some([firstNumber, secondNumber], (number) => _.isNumber(number))
    );
  };

  private static isNullOrEmptyCoordinates = (
    coordinates: Coordinates
  ): boolean => {
    return (
      _.isNil(coordinates) ||
      (_.isNil(coordinates.latitude) && _.isNil(coordinates.longitude))
    );
  };

  private static areDifferentCoordinates(
    firstCoordinates: Coordinates,
    secondCoordinates: Coordinates
  ): boolean {
    if (
      _.every([firstCoordinates, secondCoordinates], (coordinates) => {
        return this.isNullOrEmptyCoordinates(coordinates);
      })
    ) {
      return false;
    }

    if (
      _.some([firstCoordinates, secondCoordinates], (coordinates) => {
        return this.isNullOrEmptyCoordinates(coordinates);
      })
    ) {
      return false;
    }

    return (
      this.areDifferentNumbers(
        firstCoordinates.latitude,
        secondCoordinates.latitude
      ) ||
      this.areDifferentNumbers(
        firstCoordinates.longitude,
        secondCoordinates.longitude
      )
    );
  }

  public static isInventaireUpdated(
    inventaireFromDB: Inventaire,
    inventaireFromForm: Inventaire
  ): boolean {
    if (
      inventaireFromDB.observateurId !== inventaireFromForm.observateurId ||
      !isSameDay(
        interpretBrowserDateAsTimestampDate(new Date(inventaireFromForm.date)),
        interpretBrowserDateAsTimestampDate(new Date(inventaireFromDB.date))
      ) ||
      inventaireFromDB.heure !== inventaireFromForm.heure ||
      inventaireFromDB.duree !== inventaireFromForm.duree ||
      inventaireFromDB.lieuditId !== inventaireFromForm.lieuditId ||
      this.areDifferentNumbers(
        inventaireFromDB.customizedAltitude,
        inventaireFromForm.customizedAltitude
      ) ||
      this.areDifferentCoordinates(
        inventaireFromDB.coordinates,
        inventaireFromForm.coordinates
      ) ||
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
