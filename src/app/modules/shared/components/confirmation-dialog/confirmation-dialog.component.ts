import { ChangeDetectionStrategy, Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ConfirmationDialogData } from "./confirmation-dialog-data.object";

@Component({
  selector: "confirmation-dialog",
  templateUrl: "./confirmation-dialog.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData
  ) {}

  public closeDialog(): void {
    this.dialogRef.close();
  }
}
