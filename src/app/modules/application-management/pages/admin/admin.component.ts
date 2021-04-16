import { ChangeDetectionStrategy, Component } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { BackendApiService } from "src/app/services/backend-api.service";
import { StatusMessageService } from "../../../../services/status-message.service";

@Component({
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminComponent {
  public isWaitPanelDisplayed$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  constructor(
    private backendApiService: BackendApiService,
    private statusMessageService: StatusMessageService
  ) { }

  public onUpdateDatabaseButtonClicked = (): void => {
    this.displayWaitPanel();
    this.backendApiService.updateDatabase().subscribe(() => {
      this.hideWaitPanel();
      this.statusMessageService.showSuccessMessage(
        "La base de données a été mise à jour."
      );
    });
  };

  public onClearDatabaseButtonClicked = (): void => {
    this.displayWaitPanel();
    this.backendApiService.clearDatabase().subscribe(() => {
      this.hideWaitPanel();
      this.statusMessageService.showSuccessMessage(
        "La base de données a été réinitialisée."
      );
    });
  }

  private displayWaitPanel = (): void => {
    this.isWaitPanelDisplayed$.next(true);
  };

  private hideWaitPanel = (): void => {
    this.isWaitPanelDisplayed$.next(false);
  };
}
