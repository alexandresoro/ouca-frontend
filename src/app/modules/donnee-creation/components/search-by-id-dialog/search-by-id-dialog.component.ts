import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material";

@Component({
  selector: "search-by-id-dialog",
  templateUrl: "./search-by-id-dialog.tpl.html"
})
export class SearchByIdDialogComponent {
  public idToSearch: number;

  constructor(public dialogRef: MatDialogRef<SearchByIdDialogComponent>) {}

  closeDialog() {
    this.dialogRef.close();
  }
}
