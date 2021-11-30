import deburr from 'lodash.deburr';

const findEntityInListByAttribute = <T>(
  entities: T[],
  comparedAttributeName: keyof T,
  searchedValue: unknown
): T | undefined => {
  if (!searchedValue || !entities) {
    return null;
  }

  return entities.find(
    (entity) => entity[comparedAttributeName] === searchedValue
  );
}

export const findEntityInListByStringAttribute = <T extends { [key: string]: unknown }>(
  entities: T[],
  comparedAttributeName: keyof T,
  searchedValue: string,
  exactSearch?: boolean
): T | undefined => {
  if (exactSearch) {
    return findEntityInListByAttribute(
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
