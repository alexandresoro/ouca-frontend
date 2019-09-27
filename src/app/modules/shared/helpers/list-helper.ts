import * as diacritics from "diacritics";
import * as _ from "lodash";
import { EntiteSimple } from "basenaturaliste-model/entite-simple.object";

export class ListHelper {
  private static findEntityInListByAttribute(
    entities: EntiteSimple[],
    comparedAttributeName: string,
    searchedValue: number | string
  ): EntiteSimple | null {
    if (!searchedValue) {
      return null;
    }

    return entities.find(
      (entity) => entity[comparedAttributeName] === searchedValue
    );
  }

  public static findEntityInListByNumberAttribute(
    entities: EntiteSimple[],
    comparedAttributeName: string,
    searchedValue: number
  ): EntiteSimple | null {
    return this.findEntityInListByAttribute(
      entities,
      comparedAttributeName,
      searchedValue
    );
  }

  public static findEntityInListByStringAttribute(
    entities: EntiteSimple[],
    comparedAttributeName: string,
    searchedValue: string,
    exactSearch?: boolean
  ): EntiteSimple {
    if (exactSearch) {
      return this.findEntityInListByAttribute(
        entities,
        comparedAttributeName,
        searchedValue
      );
    }

    if (!searchedValue) {
      return null;
    }

    return _.find(entities, (entity: EntiteSimple) => {
      return (
        diacritics.remove(
          entity[comparedAttributeName].trim().toLowerCase()
        ) === diacritics.remove(searchedValue.trim().toLowerCase())
      );
    });
  }

  public static findEntityInListByID(
    entities: EntiteSimple[],
    id: number
  ): EntiteSimple | null {
    return this.findEntityInListByAttribute(entities, "id", id);
  }

  public static getIDsFromEntities = (entities: EntiteSimple[]): number[] => {
    return _.map(entities, (entity: EntiteSimple) => {
      return entity.id;
    });
  };

  public static getEntitiesFromIDs(
    allEntities: EntiteSimple[],
    idsToGet: number[]
  ): EntiteSimple[] {
    return _.map(idsToGet, (id) => {
      return ListHelper.findEntityInListByNumberAttribute(
        allEntities,
        "id",
        id
      );
    });
  }
}
