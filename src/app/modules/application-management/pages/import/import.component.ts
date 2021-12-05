import { HttpClient } from "@angular/common/http";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { StatusMessageService } from "src/app/services/status-message.service";
import { OngoingImportDialog } from '../../components/ongoing-import-dialog/ongoing-import-dialog.component';

@Component({
  templateUrl: "./import.component.html",
  styleUrls: ["./import.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportComponent {
  private file: File;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private statusMessageService: StatusMessageService
  ) { }

  public setFile = (event: Event): void => {
    this.file = (event.target as HTMLInputElement & EventTarget).files[0];
  };

  public onImportClicked = (entityName: string): void => {
    const data = new FormData();
    data.append('file', this.file);

    this.http.post<{ uploadId: string }>(`/uploads/${entityName}`, data).subscribe((data) => {
      if (data?.uploadId) {
        // The file has been uploaded, import will be treated on server side
        this.displayWaitPanel(data.uploadId);

      } else {
        this.statusMessageService.showErrorMessage(`Une erreur est survenue lors de l'envoi du fichier d'import`);
      }
    });

  };

  private displayWaitPanel = (importId: string): void => {
    this.dialog.open(OngoingImportDialog, {
      data: { importId },
      width: "800px",
      hasBackdrop: true,
      disableClose: true
    });
  };

}
