import { ChangeDetectionStrategy, Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { MutationDeleteSexeArgs, SexeWithCounts } from "src/app/model/graphql";
import { downloadFile } from "src/app/modules/shared/helpers/file-downloader.helper";
import { DOWNLOAD_PATH, EXCEL_FILE_EXTENSION } from "src/app/modules/shared/helpers/utils";
import { StatusMessageService } from "src/app/services/status-message.service";
import { SexeTableComponent } from "../../components/table/sexe-table/sexe-table.component";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

type DeleteSexeMutationResult = {
  deleteSexe: number | null
}

type ExportSexesResult = {
  exportSexes: string | null
}

const DELETE_SEXE = gql`
  mutation DeleteSexe($id: Int!) {
    deleteSexe(id: $id)
  }
`;

const EXPORT_SEXES = gql`
  query ExportSexes {
    exportSexes
  }
`;

@Component({
  templateUrl: "./sexe.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SexeComponent extends EntiteSimpleComponent<SexeWithCounts> {
  constructor(
    private apollo: Apollo,
    private statusMessageService: StatusMessageService,
    dialog: MatDialog,
    router: Router
  ) {
    super(dialog, router);
  }

  @ViewChild(SexeTableComponent)
  private tableComponent!: SexeTableComponent;

  getDeleteMutation(entity: SexeWithCounts): Observable<number | null> {
    return this.apollo.mutate<DeleteSexeMutationResult, MutationDeleteSexeArgs>({
      mutation: DELETE_SEXE,
      variables: {
        id: entity?.id
      }
    }).pipe(
      map(({ data }) => data?.deleteSexe)
    );
  }

  handleEntityDeletionResult(id: number | null): void {
    if (id) {
      void this.tableComponent.updateEntities();
      this.statusMessageService.showSuccessMessage("Le sexe a été supprimé avec succès.");
    } else {
      this.statusMessageService.showErrorMessage("Une erreur est survenue pendant la suppression.");
    }
  }

  public exportSexes = (): void => {
    this.apollo.query<ExportSexesResult>({
      query: EXPORT_SEXES,
      fetchPolicy: "network-only"
    }).subscribe(({ data }) => {
      if (data?.exportSexes) {
        downloadFile(DOWNLOAD_PATH + data?.exportSexes, this.getEntityName() + EXCEL_FILE_EXTENSION);
      }
    })
  }


  getEntityName(): string {
    return "sexe";
  }

  public getDeleteMessage(sexe: SexeWithCounts): string {
    return `Êtes-vous certain de vouloir supprimer le sexe ${sexe.libelle} ? Toutes les données (${sexe.nbDonnees}) avec ce sexe seront supprimées.`;
  }
}
