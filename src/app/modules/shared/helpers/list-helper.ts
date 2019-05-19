import * as diacritics from "diacritics";
import * as _ from "lodash";

export class ListHelper {
  public static getFromList(
    list: any[],
    comparisonField: string,
    valueToFind: any
  ): any {
    return list.find((object) => object[comparisonField] === valueToFind);
  }

  public static mapEntitiesToAttributes(list: any, attributeName: string) {
    return _.map(list, (entity: any) => {
      return entity[attributeName];
    });
  }

  public static mapEntitiesToIds(list: any) {
    return this.mapEntitiesToAttributes(list, "id");
  }

  public static mapAttributesToEntities(
    list: any[],
    comparisonField: string,
    valuesToFind: any[]
  ): any[] {
    return _.map(valuesToFind, (valueToFind) => {
      return ListHelper.getFromList(list, comparisonField, valueToFind);
    });
  }

  public static mapIdsToEntities(list: any[], valuesToFind: any[]) {
    return this.mapAttributesToEntities(list, "id", valuesToFind);
  }

  public static findObjectInListByTextValue(
    objects: any[],
    attributeName: string,
    searchedValue: string
  ): any {
    return _.find(objects, (object: any) => {
      return (
        diacritics.remove(object[attributeName].trim().toLowerCase()) ===
        diacritics.remove(searchedValue.trim().toLowerCase())
      );
    });
  }
}
