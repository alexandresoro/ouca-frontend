import { ChangeDetectionStrategy, Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ComportementWithCounts, MutationDeleteComportementArgs } from "src/app/model/graphql";
import { downloadFile } from "src/app/modules/shared/helpers/file-downloader.helper";
import { DOWNLOAD_PATH, EXCEL_FILE_EXTENSION } from "src/app/modules/shared/helpers/utils";
import { StatusMessageService } from "src/app/services/status-message.service";
import { ComportementTableComponent } from "../../components/table/comportement-table/comportement-table.component";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

type DeleteComportementMutationResult = {
  deleteComportement: number | null
}

type ExportComportementsResult = {
  exportComportements: string | null
}

const DELETE_COMPORTEMENT = gql`
  mutation DeleteComportement($id: Int!) {
    deleteComportement(id: $id)
  }
`;

const EXPORT_COMPORTEMENTS = gql`
  query ExportComportements {
    exportComportements
  }
`;

@Component({
  templateUrl: "./comportement.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComportementComponent extends EntiteSimpleComponent<ComportementWithCounts> {
  constructor(
    private apollo: Apollo,
    private statusMessageService: StatusMessageService,
    dialog: MatDialog,
    router: Router
  ) {
    super(dialog, router);
  }

  @ViewChild(ComportementTableComponent)
  private tableComponent!: ComportementTableComponent;

  getDeleteMutation(entity: ComportementWithCounts): Observable<number | null> {
    return this.apollo.mutate<DeleteComportementMutationResult, MutationDeleteComportementArgs>({
      mutation: DELETE_COMPORTEMENT,
      variables: {
        id: entity?.id
      }
    }).pipe(
      map(({ data }) => data?.deleteComportement)
    );
  }

  handleEntityDeletionResult(id: number | null): void {
    if (id) {
      void this.tableComponent.updateEntities();
      this.statusMessageService.showSuccessMessage("Le comportement a été supprimé avec succès."
      );
    } else {
      this.statusMessageService.showErrorMessage("Une erreur est survenue pendant la suppression.");
    }
  }

  public exportComportements = (): void => {
    this.apollo.query<ExportComportementsResult>({
      query: EXPORT_COMPORTEMENTS,
      fetchPolicy: "network-only"
    }).subscribe(({ data }) => {
      if (data?.exportComportements) {
        downloadFile(DOWNLOAD_PATH + data?.exportComportements, this.getEntityName() + EXCEL_FILE_EXTENSION);
      }
    })
  }

  getEntityName(): string {
    return "comportement";
  }

  public getDeleteMessage(comportement: ComportementWithCounts): string {
    return `Êtes-vous certain de vouloir supprimer le comportement ${comportement.libelle} ?  ${comportement.nbDonnees} données ont ce comportement.`;
  }
}
