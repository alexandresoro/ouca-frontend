import { ChangeDetectionStrategy, Component } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { BackendApiService } from "src/app/services/backend-api.service";
import { StatusMessageService } from "../../../../services/status-message.service";
import {
  getContentTypeFromResponse,
  getFileNameFromResponseContentDisposition,
  saveFile
} from "../../../shared/helpers/file-downloader.helper";

@Component({
  templateUrl: "./database.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatabaseComponent {
  public isWaitPanelDisplayed$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  constructor(
    private backendApiService: BackendApiService,
    private statusMessageService: StatusMessageService
  ) {}

  public onSaveDatabaseClicked = (): void => {
    this.displayWaitPanel();
    this.backendApiService.saveDatabase().subscribe((response) => {
      saveFile(
        response.body,
        getFileNameFromResponseContentDisposition(response),
        getContentTypeFromResponse(response)
      );
      this.hideWaitPanel();
      this.statusMessageService.showSuccessMessage(
        "La sauvegarde de la base de données est terminée."
      );
    });
  };

  private displayWaitPanel = (): void => {
    this.isWaitPanelDisplayed$.next(true);
  };

  private hideWaitPanel = (): void => {
    this.isWaitPanelDisplayed$.next(false);
  };
}
