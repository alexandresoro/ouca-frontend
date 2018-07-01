import { Component } from "@angular/core";
import { ImportService } from "./import.service";

@Component({
  templateUrl: "./import.tpl.html"
})
export class ImportComponent {
  private fileName: string;

  public isWaitPanelDisplayed: boolean = false;

  constructor(private importService: ImportService) {}

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
    this.importService.importData(this.fileName, dataType).subscribe(
      (result: any) => {
        // TODO
        this.hideWaitPanel();
      },
      (error: any) => {
        // TODO
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
