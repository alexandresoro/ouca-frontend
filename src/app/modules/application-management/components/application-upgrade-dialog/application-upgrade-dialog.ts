import { ChangeDetectionStrategy, Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppVersion } from 'src/app/model/websocket/websocket-appversion.type';
import { BackendApiService } from 'src/app/services/backend-api.service';
import { StatusMessageService } from 'src/app/services/status-message.service';

@Component({
  selector: "application-upgrade-dialog",
  styleUrls: ["./application-upgrade-dialog.scss"],
  templateUrl: "./application-upgrade-dialog.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicationUpgradeDialog {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AppVersion,
    private backendApiService: BackendApiService,
    private dialogRef: MatDialogRef<ApplicationUpgradeDialog>,
    private statusMessageService: StatusMessageService
  ) {

  }

  updateDatabaseClicked = (): void => {
    this.backendApiService.updateDatabase().subscribe(() => {
      this.statusMessageService.showSuccessMessage("La base de données a été mise à jour avec succès");
      this.dialogRef.close();
    });
  };


}
