import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { IMPORT } from 'src/app/model/websocket/websocket-message-type.model';
import { BackendWsService } from 'src/app/services/backend-ws.service';
import { OngoingImportDialog } from '../../components/ongoing-import-dialog/ongoing-import-dialog.component';
@Component({
  templateUrl: "./import.component.html",
  styleUrls: ["./import.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportComponent {
  private file: File;

  constructor(
    private backendWsService: BackendWsService,

    private dialog: MatDialog,
  ) { }

  public setFile = (event: Event): void => {
    this.file = (event.target as HTMLInputElement & EventTarget).files[0];
  };

  public onImportClicked = (entityName: string): void => {
    this.displayWaitPanel();

    const fileReader = new FileReader();

    fileReader.onload = (event) => {
      this.backendWsService.sendMessage({
        type: IMPORT,
        content: {
          dataType: entityName,
          data: event.target.result
        }
      });
    }

    fileReader.readAsText(this.file);

  };

  private displayWaitPanel = (): void => {
    this.dialog.open(OngoingImportDialog, {
      width: "800px",
      hasBackdrop: true,
      disableClose: true
    });
  };

}
