import { ChangeDetectionStrategy, Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { EspeceWithCounts, MutationDeleteEspeceArgs } from "src/app/model/graphql";
import { downloadFile } from "src/app/modules/shared/helpers/file-downloader.helper";
import { DOWNLOAD_PATH, EXCEL_FILE_EXTENSION } from "src/app/modules/shared/helpers/utils";
import { StatusMessageService } from "src/app/services/status-message.service";
import { EspeceTableComponent } from "../../components/table/espece-table/espece-table.component";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

type DeleteEspeceMutationResult = {
  deleteEspece: number | null
}

type ExportEspecesResult = {
  exportEspeces: string | null
}

const DELETE_ESPECE = gql`
  mutation DeleteEspece($id: Int!) {
    deleteEspece(id: $id)
  }
`;

const EXPORT_ESPECES = gql`
  query ExportEspeces {
    exportEspeces
  }
`;

@Component({
  templateUrl: "./espece.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EspeceComponent extends EntiteSimpleComponent<EspeceWithCounts> {
  constructor(
    private apollo: Apollo,
    private statusMessageService: StatusMessageService,
    dialog: MatDialog,
    router: Router
  ) {
    super(dialog, router);
  }

  @ViewChild(EspeceTableComponent)
  private tableComponent!: EspeceTableComponent;

  getDeleteMutation(entity: EspeceWithCounts): Observable<number | null> {
    return this.apollo.mutate<DeleteEspeceMutationResult, MutationDeleteEspeceArgs>({
      mutation: DELETE_ESPECE,
      variables: {
        id: entity?.id
      }
    }).pipe(
      map(({ data }) => data?.deleteEspece)
    );
  }

  handleEntityDeletionResult(id: number | null): void {
    if (id) {
      void this.tableComponent.updateEntities();
      this.statusMessageService.showSuccessMessage("L'espèce a été supprimée avec succès.");
    } else {
      this.statusMessageService.showErrorMessage("Une erreur est survenue pendant la suppression.");
    }
  }

  public exportEspeces = (): void => {
    this.apollo.query<ExportEspecesResult>({
      query: EXPORT_ESPECES,
      fetchPolicy: "network-only"
    }).subscribe(({ data }) => {
      if (data?.exportEspeces) {
        downloadFile(DOWNLOAD_PATH + data?.exportEspeces, this.getEntityName() + EXCEL_FILE_EXTENSION);
      }
    })
  }

  getEntityName(): string {
    return "espece";
  }

  public getDeleteMessage(espece: EspeceWithCounts): string {
    return `Êtes-vous certain de vouloir supprimer l'espèce ${espece.nomFrancais} ? Toutes les données (${espece.nbDonnees}) avec cette espèce seront supprimées.`;
  }
}
