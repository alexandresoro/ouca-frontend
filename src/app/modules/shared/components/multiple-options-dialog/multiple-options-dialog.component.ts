import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { MultipleOptionsDialogData } from "./multiple-options-dialog-data.object";

@Component({
  selector: "multiple-options-dialog",
  templateUrl: "./multiple-options-dialog.tpl.html"
})
export class MultipleOptionsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<MultipleOptionsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MultipleOptionsDialogData
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }
}
