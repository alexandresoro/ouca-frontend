import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import {
  StatusMessageSeverity,
  StatusMessageComponent,
  StatusMessageParameters
} from "../components/status-message/status-message.component";

export class PageComponent {
  constructor(protected snackbar: MatSnackBar) {}

  private showStatusMessage = (
    message: string,
    severity: StatusMessageSeverity,
    error?: any
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

  protected showErrorMessage = (message: string, error?: any): void => {
    this.showStatusMessage(message, StatusMessageSeverity.ERROR, error);
    console.error(message, error);
  };

  protected showSuccessMessage = (message: string): void => {
    this.showStatusMessage(message, StatusMessageSeverity.SUCCESS);
  };
}
