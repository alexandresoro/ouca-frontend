import { Component } from "@angular/core";
import { PageComponent } from "../../../shared/components/page.component";
import { BackendApiService } from "../../../shared/services/backend-api.service";
@Component({
  templateUrl: "./import.tpl.html"
})
export class ImportComponent extends PageComponent {
  private fileName: string;
  private file: any;

  public isWaitPanelDisplayed: boolean = false;

  constructor(private backendApiService: BackendApiService) {
    super();
  }

  /* CALLED FROM THE UI */

  public setFile(event: any): void {
    this.fileName = event.target.files[0].name;
    this.file = event.target.files[0];
  }
  public onImportClicked(dataType: string): void {
    // this.importData(dataType);
    this.backendApiService.importData("observateur", "observateur").subscribe(
      (result) => {
        // TODO
      },
      (error) => {
        // TODO
      }
    );
  }

  /* END CALLED FROM THE UI */

  private importData(dataType: string): void {
    this.displayWaitPanel();

    // this.entiteAvecLibelleEtCodeImportService.readFile(this.file);

    this.hideWaitPanel();
  }

  public displayWaitPanel(): void {
    this.isWaitPanelDisplayed = true;
  }

  public hideWaitPanel(): void {
    this.isWaitPanelDisplayed = false;
  }
}
