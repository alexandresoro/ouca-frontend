import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { SelectDialogData } from "./select-dialog-data.object";

@Component({
  selector: "select-dialog",
  templateUrl: "./select-dialog.tpl.html"
})
export class SelectDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SelectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SelectDialogData
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }
}
