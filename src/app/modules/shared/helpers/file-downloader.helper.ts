import { HttpResponse } from "@angular/common/http";
import { saveAs } from "file-saver";

const DEFAULT_FILE_NAME = "untitled";

/**
 * Saves a file by opening file-save-as dialog in the browser
 * using file-save library.
 * @param blobContent file content as a Blob
 * @param fileName name file should be saved as
 */
export const saveFile = (
  blobContent: Blob,
  fileName: string,
  mediaType?: string
) => {
  const blob = new Blob([blobContent], {
    type: !!mediaType ? mediaType : "application/octet-stream"
  });
  saveAs(blob, fileName);
};

export const getContentTypeFromResponse = (
  res: HttpResponse<any>
): string | null => {
  return !!res.headers.get("content-type")
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
  if (!!res.headers.get("content-disposition")) {
    const contentDisposition = res.headers.get("content-disposition");
    const matches = /filename="([^;]+)"/gi.exec(contentDisposition);
    const fileName = (matches[1] || DEFAULT_FILE_NAME).trim();
    return fileName;
  }
  return DEFAULT_FILE_NAME;
};
