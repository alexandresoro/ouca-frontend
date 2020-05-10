import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "network-unavailable-dialog",
  styleUrls: ["./network-unavailable-dialog.component.scss"],
  templateUrl: "./network-unavailable-dialog.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NetworkUnavailableDialogComponent {}
