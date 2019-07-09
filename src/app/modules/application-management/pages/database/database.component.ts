import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import moment = require("moment");
import { PageComponent } from "../../../shared/components/page.component";
import {
  getContentTypeFromResponse,
  getFileNameFromResponseContentDisposition,
  saveFile
} from "../../../shared/helpers/file-downloader.helper";
import { BackendApiService } from "../../../shared/services/backend-api.service";

@Component({
  templateUrl: "./database.tpl.html"
})
export class DatabaseComponent extends PageComponent {
  public isWaitPanelDisplayed: boolean = false;

  private readonly DUMP_FILE_NAME: string = "sauvegarde_base_naturaliste_";
  private readonly SQL_EXTENSION: string = ".sql";

  constructor(
    private http: HttpClient,
    private backendApiService: BackendApiService
  ) {
    super();
  }

  private getSaveDatabaseFileName = (): string => {
    return (
      this.DUMP_FILE_NAME + moment().format("YYYY-MM-DD") + this.SQL_EXTENSION
    );
  }

  public onSaveDatabaseClicked(): void {
    this.displayWaitPanel();
    this.backendApiService.saveDatabase().subscribe(
      (response) => {
        console.log("Sauvegarde terminée");
        saveFile(
          response.body,
          getFileNameFromResponseContentDisposition(response),
          getContentTypeFromResponse(response)
        );
        this.hideWaitPanel();
      },
      (error) => {
        this.hideWaitPanel();
      }
    );
  }

  private displayWaitPanel(): void {
    this.isWaitPanelDisplayed = true;
  }

  private hideWaitPanel(): void {
    this.isWaitPanelDisplayed = false;
  }
}
