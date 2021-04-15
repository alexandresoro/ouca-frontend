import { HttpResponse } from "@angular/common/http";

const DEFAULT_FILE_NAME = "untitled";

/**
 * Saves a file by opening file-save-as dialog in the browser
 */
export const saveFile = (
  blobContent: BlobPart,
  fileName: string,
  mediaType = "application/octet-stream"
): void => {

  const blob = new Blob([blobContent], {
    type: mediaType
  });

  const blobUrl = URL.createObjectURL(blob);
  const temporaryA = document.createElement('a');
  temporaryA.href = blobUrl;
  temporaryA.download = fileName;

  temporaryA.click();

  temporaryA.remove();
  URL.revokeObjectURL(blobUrl);
};

export const getContentTypeFromResponse = (
  res: HttpResponse<any>
): string | null => {
  return res.headers.get("content-type")
    ? res.headers.get("content-type")
    : null;
};

/**
 * Derives file name from the http response
 * by looking inside content-disposition
 * @param res http Response
 */
export const getFileNameFromResponseContentDisposition = (
  res: HttpResponse<any>
): string => {
  if (res.headers.get("content-disposition")) {
    const contentDisposition = res.headers.get("content-disposition");
    const matches = /filename="([^;]+)"/gi.exec(contentDisposition);
    const fileName = (matches[1] || DEFAULT_FILE_NAME).trim();
    return fileName;
  }
  return DEFAULT_FILE_NAME;
};
