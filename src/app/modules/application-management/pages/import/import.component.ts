import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BackendApiService } from "src/app/services/backend-api.service";
import { StatusMessageService } from "../../../../services/status-message.service";
import {
  getContentTypeFromResponse,
  saveFile
} from "../../../shared/helpers/file-downloader.helper";
import { OngoingImportDialog } from '../../components/ongoing-import-dialog/ongoing-import-dialog.component';
@Component({
  templateUrl: "./import.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportComponent {
  private file: File;

  private matDialogRef: MatDialogRef<unknown>;


  constructor(
    private backendApiService: BackendApiService,
    private dialog: MatDialog,
    private statusMessageService: StatusMessageService
  ) { }

  public setFile = (event: Event): void => {
    this.file = (event.target as HTMLInputElement & EventTarget).files[0];
  };

  public onImportClicked = (entityName: string): void => {
    this.displayWaitPanel();

    this.backendApiService.importData(entityName, this.file).subscribe(
      (response) => {
        saveFile(
          response.body,
          this.file.name.split(".csv")[0] + ".erreurs.csv",
          getContentTypeFromResponse(response)
        );
        this.hideWaitPanel();
      },
      (error) => {
        this.hideWaitPanel();
        this.statusMessageService.showErrorMessage(
          "Une erreur est survenue pendant l'import",
          error
        );
      }
    );
  };

  private displayWaitPanel = (): void => {
    this.matDialogRef = this.dialog.open(OngoingImportDialog, {
      width: "800px",
      hasBackdrop: true,
      disableClose: true
    });
  };

  private hideWaitPanel = (): void => {
    this.matDialogRef?.close();
  };
}
