import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import {
  StatusMessageSeverity,
  StatusMessageComponent,
  StatusMessageParameters
} from "../components/status-message/status-message.component";

export class PageComponent {
  constructor(protected snackbar: MatSnackBar) {}

  protected openStatusMessage = (
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
      duration: 5000
    } as MatSnackBarConfig<StatusMessageParameters>);
  };
}
