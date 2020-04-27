import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "search-by-id-dialog",
  templateUrl: "./search-by-id-dialog.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchByIdDialogComponent {
  public idToSearch: number;

  constructor(public dialogRef: MatDialogRef<SearchByIdDialogComponent>) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
