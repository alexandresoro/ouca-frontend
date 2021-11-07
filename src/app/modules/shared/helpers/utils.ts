/**
 * Utility method that checks if a given object has a direct property
 */
export const has = (object: unknown, property: string): boolean => {
  return object && Object.prototype.hasOwnProperty.call(object, property) as boolean;
}

/**
 * Utility method that returns a new array sorted from the given array and sorting function
 */
export const sortBy = <T>(arrayToSort: T[], sortingFunction: (first: T, second: T) => number): T[] => {
  return arrayToSort.concat().sort(sortingFunction);
}

export const areArraysWithoutDuplicatesContainingSameValues = <T>(
  firstArray: T[],
  secondArray: T[]
): boolean => {
  const firstSet = new Set(firstArray);
  const secondSet = new Set(secondArray);
  if (firstSet.size !== secondSet.size) return false;
  return [...firstSet].every(value => secondSet.has(value));
};

export const DOWNLOAD_PATH = "/download/"
export const EXCEL_FILE_EXTENSION = ".xlsx"