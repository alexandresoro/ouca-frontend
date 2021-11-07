import { ChangeDetectionStrategy, Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AgeWithCounts, MutationDeleteAgeArgs } from "src/app/model/graphql";
import { downloadFile } from "src/app/modules/shared/helpers/file-downloader.helper";
import { DOWNLOAD_PATH, EXCEL_FILE_EXTENSION } from "src/app/modules/shared/helpers/utils";
import { StatusMessageService } from "src/app/services/status-message.service";
import { AgeTableComponent } from "../../components/table/age-table/age-table.component";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

type DeleteAgeMutationResult = {
  deleteAge: number | null
}

type ExportAgesResult = {
  exportAges: string | null
}

const DELETE_AGE = gql`
  mutation DeleteAge($id: Int!) {
    deleteAge(id: $id)
  }
`;

const EXPORT_AGES = gql`
  query ExportAges {
    exportAges
  }
`;

@Component({
  templateUrl: "./age.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgeComponent extends EntiteSimpleComponent<AgeWithCounts> {

  constructor(
    private apollo: Apollo,
    private statusMessageService: StatusMessageService,
    dialog: MatDialog,
    router: Router
  ) {
    super(dialog, router);
  }

  @ViewChild(AgeTableComponent)
  private tableComponent!: AgeTableComponent;

  getDeleteMutation(entity: AgeWithCounts): Observable<number | null> {
    return this.apollo.mutate<DeleteAgeMutationResult, MutationDeleteAgeArgs>({
      mutation: DELETE_AGE,
      variables: {
        id: entity?.id
      }
    }).pipe(
      map(({ data }) => data?.deleteAge)
    );
  }

  handleEntityDeletionResult(id: number | null): void {
    if (id) {
      void this.tableComponent.updateEntities();
      this.statusMessageService.showSuccessMessage("L'âge a été supprimé avec succès.");
    } else {
      this.statusMessageService.showErrorMessage("Une erreur est survenue pendant la suppression.");
    }
  }

  public exportAges = (): void => {
    this.apollo.query<ExportAgesResult>({
      query: EXPORT_AGES,
      fetchPolicy: "network-only"
    }).subscribe(({ data }) => {
      if (data?.exportAges) {
        downloadFile(DOWNLOAD_PATH + data?.exportAges, this.getEntityName() + EXCEL_FILE_EXTENSION);
      }
    })
  }

  public getEntityName(): string {
    return "age";
  }

  public getDeleteMessage(age: AgeWithCounts): string {
    return `Êtes-vous certain de vouloir supprimer l'âge ${age.libelle} ? Toutes les données (${age.nbDonnees}) avec cet âge seront supprimées.`;
  }
}
