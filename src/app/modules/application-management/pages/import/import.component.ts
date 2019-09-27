import { Component } from "@angular/core";
import {
  getContentTypeFromResponse,
  saveFile
} from "../../../shared/helpers/file-downloader.helper";
import { BackendApiService } from "../../../shared/services/backend-api.service";
import { PageComponent } from "../../../shared/pages/page.component";
import { MatSnackBar } from "@angular/material/snack-bar";
@Component({
  templateUrl: "./import.tpl.html"
})
export class ImportComponent extends PageComponent {
  private file: File;

  public isWaitPanelDisplayed: boolean = false;

  constructor(
    private backendApiService: BackendApiService,
    protected snackbar: MatSnackBar
  ) {
    super(snackbar);
  }

  /* CALLED FROM THE UI */

  public setFile(event: any): void {
    this.file = event.target.files[0];
  }
  public onImportClicked(entityName: string): void {
    this.displayWaitPanel();
    // this.importData(dataType);
    this.backendApiService.importData(entityName, this.file).subscribe(
      (response) => {
        saveFile(
          response.body,
          this.file.name.split(".csv")[0] + ".erreurs.csv",
          getContentTypeFromResponse(response)
        );
        this.hideWaitPanel();
      },
      (error) => {
        // TODO
        this.hideWaitPanel();
      }
    );
  }

  /* END CALLED FROM THE UI */

  public displayWaitPanel(): void {
    this.isWaitPanelDisplayed = true;
  }

  public hideWaitPanel(): void {
    this.isWaitPanelDisplayed = false;
  }
}
