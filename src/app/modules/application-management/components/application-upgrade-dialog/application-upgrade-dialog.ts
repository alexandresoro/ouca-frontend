import { ChangeDetectionStrategy, Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Version } from "src/app/model/graphql";
import { DatabaseUpdateService } from "src/app/services/database-update.service";
import { StatusMessageService } from 'src/app/services/status-message.service';

@Component({
  selector: "application-upgrade-dialog",
  styleUrls: ["./application-upgrade-dialog.scss"],
  templateUrl: "./application-upgrade-dialog.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicationUpgradeDialog {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Version,
    private databaseUpdateService: DatabaseUpdateService,
    private dialogRef: MatDialogRef<ApplicationUpgradeDialog>,
    private statusMessageService: StatusMessageService
  ) {

  }

  updateDatabaseClicked = (): void => {
    this.databaseUpdateService.mutate().subscribe(({ data }) => {
      this.dialogRef.close();
      if (data?.updateDatabase) {
        this.statusMessageService.showSuccessMessage(
          "La base de données a été mise à jour avec succès"
        );
      }
    });
  };


}
