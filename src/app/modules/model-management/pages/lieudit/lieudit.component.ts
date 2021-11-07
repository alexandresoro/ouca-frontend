import { ChangeDetectionStrategy, Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { MutationDeleteLieuDitArgs } from "src/app/model/graphql";
import { downloadFile } from "src/app/modules/shared/helpers/file-downloader.helper";
import { DOWNLOAD_PATH, EXCEL_FILE_EXTENSION } from "src/app/modules/shared/helpers/utils";
import { StatusMessageService } from "src/app/services/status-message.service";
import { LieuDitRow, LieuditTableComponent } from "../../components/table/lieudit-table/lieudit-table.component";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

type DeleteLieuDitMutationResult = {
  deleteLieuDit: number | null
}

type ExportLieuxDitsResult = {
  exportLieuxDits: string | null
}

const DELETE_LIEUDIT = gql`
  mutation DeleteLieuDit($id: Int!) {
    deleteLieuDit(id: $id)
  }
`;

const EXPORT_LIEUX_DITS = gql`
  query ExportLieuxDits {
    exportLieuxDits
  }
`;

@Component({
  templateUrl: "./lieudit.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LieuditComponent extends EntiteSimpleComponent<LieuDitRow> {
  constructor(
    private apollo: Apollo,
    private statusMessageService: StatusMessageService,
    dialog: MatDialog,
    router: Router
  ) {
    super(dialog, router);
  }

  @ViewChild(LieuditTableComponent)
  private tableComponent!: LieuditTableComponent;

  getDeleteMutation(entity: LieuDitRow): Observable<number | null> {
    return this.apollo.mutate<DeleteLieuDitMutationResult, MutationDeleteLieuDitArgs>({
      mutation: DELETE_LIEUDIT,
      variables: {
        id: entity?.id
      }
    }).pipe(
      map(({ data }) => data?.deleteLieuDit)
    );
  }

  handleEntityDeletionResult(id: number | null): void {
    if (id) {
      void this.tableComponent.updateEntities();
      this.statusMessageService.showSuccessMessage("Le lieu-dit a été supprimé avec succès.");
    } else {
      this.statusMessageService.showErrorMessage("Une erreur est survenue pendant la suppression.");
    }
  }

  public exportLieuxDits = (): void => {
    this.apollo.query<ExportLieuxDitsResult>({
      query: EXPORT_LIEUX_DITS,
      fetchPolicy: "network-only"
    }).subscribe(({ data }) => {
      if (data?.exportLieuxDits) {
        downloadFile(DOWNLOAD_PATH + data?.exportLieuxDits, this.getEntityName() + EXCEL_FILE_EXTENSION);
      }
    })
  }

  getEntityName(): string {
    return "lieudit";
  }

  public getDeleteMessage(lieuDit: LieuDitRow): string {
    return `Êtes-vous certain de vouloir supprimer le lieu-dit ${lieuDit.nom} ? Toutes les données (${lieuDit.nbDonnees}) avec ce lieu-dit seront supprimées.`;
  }
}
