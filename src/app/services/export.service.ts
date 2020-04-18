import { Injectable } from "@angular/core";
import {
  getContentTypeFromResponse,
  saveFile
} from "../modules/shared/helpers/file-downloader.helper";
import { BackendApiService } from "./backend-api.service";

@Injectable({
  providedIn: "root"
})
export class ExportService {
  constructor(private backendApiService: BackendApiService) {}

  public exportEntities(entityName: string): void {
    this.backendApiService.exportData(entityName).subscribe((response: any) => {
      saveFile(
        response.body,
        entityName + ".xlsx",
        getContentTypeFromResponse(response)
      );
    });
  }
}
