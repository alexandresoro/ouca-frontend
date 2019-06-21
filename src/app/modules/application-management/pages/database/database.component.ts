import { Component } from "@angular/core";
import { PageComponent } from "../../../shared/components/page.component";
import { BackendApiService } from "../../../shared/services/backend-api.service";
@Component({
  templateUrl: "./database.tpl.html"
})
export class DatabaseComponent extends PageComponent {

  public isWaitPanelDisplayed: boolean = false;

  constructor(private backendApiService: BackendApiService) {
    super();
  }

  public onSaveDatabaseClicked(): void {
    this.displayWaitPanel();
    this.backendApiService.saveDatabase().subscribe(
      (result) => {
        console.log("Sauvegarde terminée");
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
