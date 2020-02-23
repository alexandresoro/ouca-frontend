import { EntiteSimple } from "basenaturaliste-model/entite-simple.object";
import * as _ from "lodash";

export class ListHelper {
  private static findEntityInListByAttribute<T extends EntiteSimple>(
    entities: T[],
    comparedAttributeName: string,
    searchedValue: number | string
  ): T | null {
    if (!searchedValue) {
      return null;
    }

    return entities.find(
      entity => entity[comparedAttributeName] === searchedValue
    );
  }

  public static findEntityInListByNumberAttribute<T extends EntiteSimple>(
    entities: T[],
    comparedAttributeName: string,
    searchedValue: number
  ): T | null {
    return this.findEntityInListByAttribute(
      entities,
      comparedAttributeName,
      searchedValue
    );
  }

  public static findEntityInListByStringAttribute<T extends EntiteSimple>(
    entities: T[],
    comparedAttributeName: string,
    searchedValue: string,
    exactSearch?: boolean
  ): T {
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

    return _.find(entities, (entity: T) => {
      return (
        _.deburr(entity[comparedAttributeName].trim().toLowerCase()) ===
        _.deburr(searchedValue.trim().toLowerCase())
      );
    });
  }

  public static findEntityInListByID<T extends EntiteSimple>(
    entities: T[],
    id: number
  ): T | null {
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
    return _.map(idsToGet, id => {
      return ListHelper.findEntityInListByNumberAttribute(
        allEntities,
        "id",
        id
      );
    });
  }
}
