import { ChangeDetectionStrategy, Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { CommuneWithCounts, MutationDeleteCommuneArgs } from "src/app/model/graphql";
import { downloadFile } from "src/app/modules/shared/helpers/file-downloader.helper";
import { DOWNLOAD_PATH, EXCEL_FILE_EXTENSION } from "src/app/modules/shared/helpers/utils";
import { StatusMessageService } from "src/app/services/status-message.service";
import { CommuneTableComponent } from "../../components/table/commune-table/commune-table.component";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

type DeleteCommuneMutationResult = {
  deleteCommune: number | null
}

type ExportCommunesResult = {
  exportCommunes: string | null
}

const DELETE_COMMUNE = gql`
  mutation DeleteCommune($id: Int!) {
    deleteCommune(id: $id)
  }
`;

const EXPORT_COMMUNES = gql`
  query ExportCommunes {
    exportCommunes
  }
`;

@Component({
  templateUrl: "./commune.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommuneComponent extends EntiteSimpleComponent<CommuneWithCounts> {
  constructor(
    private apollo: Apollo,
    private statusMessageService: StatusMessageService,
    dialog: MatDialog,
    router: Router
  ) {
    super(dialog, router);
  }

  @ViewChild(CommuneTableComponent)
  private tableComponent!: CommuneTableComponent;

  getDeleteMutation(entity: CommuneWithCounts): Observable<number | null> {
    return this.apollo.mutate<DeleteCommuneMutationResult, MutationDeleteCommuneArgs>({
      mutation: DELETE_COMMUNE,
      variables: {
        id: entity?.id
      }
    }).pipe(
      map(({ data }) => data?.deleteCommune)
    );
  }

  handleEntityDeletionResult(id: number | null): void {
    if (id) {
      void this.tableComponent.updateEntities();
      this.statusMessageService.showSuccessMessage("La commune a été supprimée avec succès."
      );
    } else {
      this.statusMessageService.showErrorMessage("Une erreur est survenue pendant la suppression.");
    }
  }

  public exportCommunes = (): void => {
    this.apollo.query<ExportCommunesResult>({
      query: EXPORT_COMMUNES,
      fetchPolicy: "network-only"
    }).subscribe(({ data }) => {
      if (data?.exportCommunes) {
        downloadFile(DOWNLOAD_PATH + data?.exportCommunes, this.getEntityName() + EXCEL_FILE_EXTENSION);
      }
    })
  }

  getEntityName(): string {
    return "commune";
  }

  public getDeleteMessage(commune: CommuneWithCounts): string {
    return `Êtes-vous certain de vouloir supprimer la commune ${commune.nom} ? Tous les lieux-dits (${commune.nbLieuxDits}) et toutes les données (${commune.nbDonnees}) avec cette commune seront supprimés.`;
  }
}
