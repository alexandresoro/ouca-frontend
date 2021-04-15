/**
 * Returns a CSV string from the given elements passed as an array of array using the given delimiter
 */
export const exportAsCsv = (elements: unknown[][], options?: { delimiter?: string, isCrLf?: boolean }): string => {
  const delimiter = options?.delimiter ?? ",";
  const lineDelimiter = options?.isCrLf ? "\r\n" : "\n";
  return elements.map((element) => {
    return element.join(delimiter);
  }).join(lineDelimiter);

}