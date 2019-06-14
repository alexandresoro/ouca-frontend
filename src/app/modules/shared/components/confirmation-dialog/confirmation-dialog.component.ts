import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ConfirmationDialogData } from "./confirmation-dialog-data.object";

@Component({
  selector: "confirmation-dialog",
  templateUrl: "./confirmation-dialog.tpl.html"
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }
}
