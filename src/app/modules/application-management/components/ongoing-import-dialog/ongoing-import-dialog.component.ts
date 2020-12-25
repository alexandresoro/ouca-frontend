import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ongoing-import-dialog",
  styleUrls: ["./ongoing-import-dialog.component.scss"],
  templateUrl: "./ongoing-import-dialog.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OngoingImportDialog { }
