import { Component } from "@angular/core";
import { PageComponent } from "../../../shared/components/page.component";
import { BackendApiService } from "../../../shared/services/backend-api.service";

@Component({
  templateUrl: "./import.tpl.html"
})
export class ImportComponent extends PageComponent {
  private fileName: string;

  public isWaitPanelDisplayed: boolean = false;

  constructor(private backendApiService: BackendApiService) {
    super();
  }

  /* CALLED FROM THE UI */

  public setFile(event: any): void {
    this.fileName = event.target.files[0].name;
  }
  public onImportClicked(dataType: string): void {
    this.importData(dataType);
  }

  /* END CALLED FROM THE UI */

  private importData(dataType: string): void {
    this.displayWaitPanel();

    // Call back-end
    this.backendApiService.importData(this.fileName, dataType).subscribe(
      (result: string) => {
        this.setInfoMessage(result);
        this.hideWaitPanel();
      },
      (error: any) => {
        console.error("Impossible d'importer le fichier", error);
        this.setErrorMessage("Impossible d'importer le fichier.");
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
