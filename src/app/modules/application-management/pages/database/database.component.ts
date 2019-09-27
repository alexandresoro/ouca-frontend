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

  public onSaveDatabaseClicked = (): void => {
    this.displayWaitPanel();
    this.backendApiService.saveDatabase().subscribe(
      (response) => {
        saveFile(
          response.body,
          getFileNameFromResponseContentDisposition(response),
          getContentTypeFromResponse(response)
        );
        this.hideWaitPanel();
        this.showSuccessMessage(
          "La sauvegarde de la base de données est terminée."
        );
      },
      (error: any) => {
        this.hideWaitPanel();
        this.showErrorMessage(
          "Il semble qu'une erreur soit survenue pendant la sauvegarde de la base de données.",
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
