import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Apollo, gql } from "apollo-angular";
import { BehaviorSubject } from "rxjs";
import { downloadFile } from "src/app/modules/shared/helpers/file-downloader.helper";
import { DOWNLOAD_PATH } from "src/app/modules/shared/helpers/utils";
import { StatusMessageService } from "../../../../services/status-message.service";

type DumpDatabaseResult = {
  dumpDatabase: string | null
}

const DUMP_DATABASE = gql`
  query DumpDatabase {
    dumpDatabase
  }
`;

@Component({
  templateUrl: "./database.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatabaseComponent {
  public isWaitPanelDisplayed$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  constructor(
    private apollo: Apollo,
    private statusMessageService: StatusMessageService
  ) { }

  public onSaveDatabaseClicked = (): void => {
    this.displayWaitPanel();

    this.apollo.query<DumpDatabaseResult>({
      query: DUMP_DATABASE,
      fetchPolicy: "network-only"
    }).subscribe(({ data }) => {
      this.hideWaitPanel();

      if (data?.dumpDatabase) {
        downloadFile(DOWNLOAD_PATH + data?.dumpDatabase, data?.dumpDatabase);
        this.statusMessageService.showSuccessMessage(
          "La sauvegarde de la base de données est terminée."
        );
      }
    })
  };

  private displayWaitPanel = (): void => {
    this.isWaitPanelDisplayed$.next(true);
  };

  private hideWaitPanel = (): void => {
    this.isWaitPanelDisplayed$.next(false);
  };
}
