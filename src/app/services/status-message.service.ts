import { Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import {
  StatusMessageComponent,
  StatusMessageParameters,
  StatusMessageSeverity
} from "../modules/shared/components/status-message/status-message.component";

@Injectable({
  providedIn: "root"
})
export class StatusMessageService {
  constructor(protected snackbar: MatSnackBar) {}

  private showStatusMessage = (
    message: string,
    severity: StatusMessageSeverity,
    error?: unknown
  ): void => {
    this.snackbar.openFromComponent(StatusMessageComponent, {
      data: {
        message: message,
        severity: severity,
        error: error
      },
      duration: 5000,
      panelClass:
        severity === StatusMessageSeverity.ERROR ? "status-message-error" : ""
    } as MatSnackBarConfig<StatusMessageParameters>);
  };

  public showErrorMessage = (message: string, error?: unknown): void => {
    this.showStatusMessage(message, StatusMessageSeverity.ERROR, error);
    console.error(message, error);
  };

  public showSuccessMessage = (message: string): void => {
    this.showStatusMessage(message, StatusMessageSeverity.SUCCESS);
  };
}
