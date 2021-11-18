import deburr from 'lodash.deburr';
import { EntiteSimple } from 'src/app/model/types/entite-simple.object';

export class ListHelper {
  private static findEntityInListByAttribute<T extends { [key: string]: unknown }>(
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

  public static findEntityInListByStringAttribute<T extends { [key: string]: unknown }>(
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
        deburr((entity[comparedAttributeName] as string).trim().toLowerCase()) ===
        deburr(searchedValue.trim().toLowerCase())
      );
    });
  }

  public static getIDsFromEntities = (entities: EntiteSimple[]): number[] => {
    return entities?.map((entity: EntiteSimple) => {
      return entity.id;
    }) ?? [];
  };

}
