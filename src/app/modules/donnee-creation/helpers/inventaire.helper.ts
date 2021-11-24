import { isSameDay } from "date-fns";
import { getCoordinates } from 'src/app/model/coordinates-system/coordinates-helper';
import { CoordinatesSystemType, InputInventaire, Inventaire } from "src/app/model/graphql";
import { Coordinates } from 'src/app/model/types/coordinates.object';
import { interpretBrowserDateAsTimestampDate } from "../../shared/helpers/time.helper";
import { areArraysWithoutDuplicatesContainingSameValues } from '../../shared/helpers/utils';

export class InventaireHelper {
  /**
   * Method that returns true if both values represent a different number, or if only one is a number
   */
  private static areDifferentNumbers = (
    firstNumber: number,
    secondNumber: number
  ): boolean => {
    return (
      (firstNumber !== secondNumber) &&
      [firstNumber, secondNumber].some((number) => Number.isFinite(number))
    );
  };

  private static isNullOrEmptyCoordinates = (
    coordinates: Coordinates
  ): boolean => {
    return (
      (coordinates == null) ||
      ((coordinates.latitude == null) && (coordinates.longitude == null))
    );
  };

  private static areDifferentCoordinates(
    firstCoordinates: Coordinates,
    secondCoordinates: Coordinates
  ): boolean {
    if (
      [firstCoordinates, secondCoordinates].every((coordinates) => {
        return this.isNullOrEmptyCoordinates(coordinates);
      })
    ) {
      return false;
    }

    if (
      [firstCoordinates, secondCoordinates].some((coordinates) => {
        return this.isNullOrEmptyCoordinates(coordinates);
      })
    ) {
      return true;
    }

    // We should compare the coordinates in the same system
    const firstCoordinatesTransformed = getCoordinates(
      { coordinates: firstCoordinates },
      secondCoordinates.system
    );

    return (
      this.areDifferentNumbers(
        firstCoordinatesTransformed.latitude,
        secondCoordinates.latitude
      ) ||
      this.areDifferentNumbers(
        firstCoordinatesTransformed.longitude,
        secondCoordinates.longitude
      )
    );
  }

  public static isInventaireUpdated(
    inventaireFromDB: Inventaire,
    inventaireFromForm: InputInventaire
  ): boolean {
    if (
      inventaireFromDB.observateur?.id !== inventaireFromForm.observateurId ||
      !isSameDay(
        interpretBrowserDateAsTimestampDate(new Date(inventaireFromForm.date)),
        interpretBrowserDateAsTimestampDate(new Date(inventaireFromDB.date))
      ) ||
      inventaireFromDB.heure !== inventaireFromForm.heure ||
      inventaireFromDB.duree !== inventaireFromForm.duree ||
      inventaireFromDB.lieuDit?.id !== inventaireFromForm.lieuDitId ||
      this.areDifferentNumbers(
        inventaireFromDB.customizedCoordinates?.altitude,
        inventaireFromForm.altitude
      ) ||
      this.areDifferentCoordinates(
        inventaireFromDB?.customizedCoordinates,
        {
          latitude: inventaireFromForm?.latitude,
          longitude: inventaireFromForm?.longitude,
          system: CoordinatesSystemType.Gps
        }
      ) ||
      inventaireFromDB.temperature !== inventaireFromForm.temperature ||
      !areArraysWithoutDuplicatesContainingSameValues(
        inventaireFromDB.associes?.map(associe => associe?.id) ?? [],
        inventaireFromForm.associesIds
      ) ||
      !areArraysWithoutDuplicatesContainingSameValues(
        inventaireFromDB.meteos?.map(meteo => meteo?.id) ?? [],
        inventaireFromForm.meteosIds
      )
    ) {
      return true;
    }

    return false;
  }
}
