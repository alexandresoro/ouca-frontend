import { Component } from "@angular/core";
import {
  getContentTypeFromResponse,
  getFileNameFromResponseContentDisposition,
  saveFile
} from "../../../shared/helpers/file-downloader.helper";
import { BackendApiService } from "../../../shared/services/backend-api.service";
import { PageComponent } from "../../../shared/pages/page.component";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  templateUrl: "./database.tpl.html"
})
export class DatabaseComponent extends PageComponent {
  public isWaitPanelDisplayed: boolean = false;

  constructor(
    private backendApiService: BackendApiService,
    protected snackbar: MatSnackBar
  ) {
    super(snackbar);
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
