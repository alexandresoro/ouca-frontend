import { ChangeDetectionStrategy, Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { MilieuWithCounts, MutationDeleteMilieuArgs } from "src/app/model/graphql";
import { downloadFile } from "src/app/modules/shared/helpers/file-downloader.helper";
import { DOWNLOAD_PATH, EXCEL_FILE_EXTENSION } from "src/app/modules/shared/helpers/utils";
import { StatusMessageService } from "src/app/services/status-message.service";
import { MilieuTableComponent } from "../../components/table/milieu-table/milieu-table.component";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

type DeleteMilieuMutationResult = {
  deleteMilieu: number | null
}

type ExportMilieuxResult = {
  exportMilieux: string | null
}

const DELETE_MILIEU = gql`
  mutation DeleteMilieu($id: Int!) {
    deleteMilieu(id: $id)
  }
`;

const EXPORT_MILIEUX = gql`
  query ExportMilieux {
    exportMilieux
  }
`;

@Component({
  templateUrl: "./milieu.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MilieuComponent extends EntiteSimpleComponent<MilieuWithCounts> {
  constructor(
    private apollo: Apollo,
    private statusMessageService: StatusMessageService,
    dialog: MatDialog,
    router: Router
  ) {
    super(dialog, router);
  }

  @ViewChild(MilieuTableComponent)
  private tableComponent!: MilieuTableComponent;

  getDeleteMutation(entity: MilieuWithCounts): Observable<number | null> {
    return this.apollo.mutate<DeleteMilieuMutationResult, MutationDeleteMilieuArgs>({
      mutation: DELETE_MILIEU,
      variables: {
        id: entity?.id
      }
    }).pipe(
      map(({ data }) => data?.deleteMilieu)
    );
  }

  handleEntityDeletionResult(id: number | null): void {
    if (id) {
      void this.tableComponent.updateEntities();
      this.statusMessageService.showSuccessMessage("Le milieu a été supprimé avec succès.");
    } else {
      this.statusMessageService.showErrorMessage("Une erreur est survenue pendant la suppression.");
    }
  }

  public exportMilieux = (): void => {
    this.apollo.query<ExportMilieuxResult>({
      query: EXPORT_MILIEUX,
      fetchPolicy: "network-only"
    }).subscribe(({ data }) => {
      if (data?.exportMilieux) {
        downloadFile(DOWNLOAD_PATH + data?.exportMilieux, this.getEntityName() + EXCEL_FILE_EXTENSION);
      }
    })
  }

  getEntityName(): string {
    return "milieu";
  }

  public getDeleteMessage(milieu: MilieuWithCounts): string {
    return `Êtes-vous certain de vouloir supprimer le milieu ${milieu.libelle} ? ${milieu.nbDonnees} données ont ce milieu.`;
  }
}
