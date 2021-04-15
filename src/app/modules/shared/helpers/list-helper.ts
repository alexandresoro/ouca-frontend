import deburr from 'lodash.deburr';
import { EntiteSimple } from 'src/app/model/types/entite-simple.object';

export class ListHelper {
  private static findEntityInListByAttribute<T extends EntiteSimple>(
    entities: T[],
    comparedAttributeName: string,
    searchedValue: number | string
  ): T | null {
    if (!searchedValue || !entities) {
      return null;
    }

    return entities.find(
      (entity) => entity[comparedAttributeName] === searchedValue
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

    return entities?.find((entity) => {
      return (
        deburr(entity[comparedAttributeName].trim().toLowerCase()) ===
        deburr(searchedValue.trim().toLowerCase())
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
    return entities?.map((entity: EntiteSimple) => {
      return entity.id;
    }) ?? [];
  };

  public static getEntitiesFromIDs = <T extends EntiteSimple>(
    allEntities: T[],
    idsToGet: number[]
  ): T[] => {
    return idsToGet?.map((id) => {
      return ListHelper.findEntityInListByNumberAttribute(
        allEntities,
        "id",
        id
      );
    }) ?? [];
  };
}
