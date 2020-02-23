import { Component } from "@angular/core";
import { StatusMessageService } from "../../../../services/status-message.service";
import {
  getContentTypeFromResponse,
  saveFile
} from "../../../shared/helpers/file-downloader.helper";
import { BackendApiService } from "../../../shared/services/backend-api.service";
@Component({
  templateUrl: "./import.tpl.html"
})
export class ImportComponent {
  private file: File;

  public isWaitPanelDisplayed: boolean = false;

  constructor(
    private backendApiService: BackendApiService,
    private statusMessageService: StatusMessageService
  ) {}

  public setFile = (event: any): void => {
    this.file = event.target.files[0];
  };

  public onImportClicked = (entityName: string): void => {
    this.displayWaitPanel();

    this.backendApiService.importData(entityName, this.file).subscribe(
      response => {
        saveFile(
          response.body,
          this.file.name.split(".csv")[0] + ".erreurs.csv",
          getContentTypeFromResponse(response)
        );
        this.hideWaitPanel();
      },
      error => {
        this.hideWaitPanel();
        this.statusMessageService.showErrorMessage(
          "Une erreur est survenue pendant l'import",
          error
        );
      }
    );
  };

  private displayWaitPanel = (): void => {
    this.isWaitPanelDisplayed = true;
  };

  private hideWaitPanel = (): void => {
    this.isWaitPanelDisplayed = false;
  };
}
