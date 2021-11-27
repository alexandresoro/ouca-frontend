import { ChangeDetectionStrategy, Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Version } from "src/app/model/graphql";
import { DatabaseInitializationService } from "src/app/services/database-initializaion-service";
import { StatusMessageService } from 'src/app/services/status-message.service';

@Component({
  selector: "database-initialization-dialog",
  styleUrls: ["./database-initialization-dialog.scss"],
  templateUrl: "./database-initialization-dialog.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatabaseInitializationDialog {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Version,
    private databaseInitializationService: DatabaseInitializationService,
    private dialogRef: MatDialogRef<DatabaseInitializationDialog>,
    private statusMessageService: StatusMessageService
  ) {

  }

  initializeDatabaseClicked = (): void => {
    this.databaseInitializationService.mutate().subscribe(({ data }) => {
      this.dialogRef.close();
      if (data?.initializeDatabase) {
        this.statusMessageService.showSuccessMessage(
          "La base de données a été initialisée avec succès"
        );
      }
    });
  };


}
