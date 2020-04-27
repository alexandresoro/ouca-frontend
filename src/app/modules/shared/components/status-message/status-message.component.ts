import { ChangeDetectionStrategy, Component, Inject } from "@angular/core";
import { MAT_SNACK_BAR_DATA } from "@angular/material/snack-bar";

export enum StatusMessageSeverity {
  ERROR,
  INFO,
  SUCCESS,
  WARNING
}

export interface StatusMessageParameters {
  severity: StatusMessageSeverity;

  error?: any;

  message: string;
}

@Component({
  templateUrl: "./status-message.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusMessageComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: StatusMessageParameters
  ) {}
}
