import { ChangeDetectionStrategy, Component } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { DatabaseInitializationService } from "src/app/services/database-initializaion-service";
import { DatabaseResetService } from "src/app/services/database-reset.service";
import { DatabaseUpdateService } from "src/app/services/database-update.service";
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
    private databaseResetService: DatabaseResetService,
    private databaseUpdateService: DatabaseUpdateService,
    private databaseInitializationService: DatabaseInitializationService,
    private statusMessageService: StatusMessageService
  ) { }

  public onUpdateDatabaseButtonClicked = (): void => {
    this.displayWaitPanel();
    this.databaseUpdateService.mutate().subscribe(({ data }) => {
      this.hideWaitPanel();
      if (data?.updateDatabase) {
        this.statusMessageService.showSuccessMessage(
          "La base de données a été mise à jour."
        );
      }
    });
  };

  public onClearDatabaseButtonClicked = (): void => {
    this.displayWaitPanel();
    this.databaseResetService.mutate().subscribe(({ data }) => {
      this.hideWaitPanel();
      if (data?.resetDatabase) {
        this.databaseInitializationService.mutate().subscribe(({ data }) => {
          if (data?.initializeDatabase) {
            this.statusMessageService.showSuccessMessage(
              "La base de données a été reinitialisée avec succès"
            );
          }
        });
      }
    });
  }

  private displayWaitPanel = (): void => {
    this.isWaitPanelDisplayed$.next(true);
  };

  private hideWaitPanel = (): void => {
    this.isWaitPanelDisplayed$.next(false);
  };
}
