import { ChangeDetectionStrategy, Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { DepartementWithCounts, MutationDeleteDepartementArgs } from "src/app/model/graphql";
import { downloadFile } from "src/app/modules/shared/helpers/file-downloader.helper";
import { DOWNLOAD_PATH, EXCEL_FILE_EXTENSION } from "src/app/modules/shared/helpers/utils";
import { ExportService } from "src/app/services/export.service";
import { StatusMessageService } from "src/app/services/status-message.service";
import { DepartementTableComponent } from "../../components/table/departement-table/departement-table.component";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

type DeleteDepartementMutationResult = {
  deleteDepartement: number | null
}

type ExportDepartementsResult = {
  exportDepartements: string | null
}

const DELETE_DEPARTEMENT = gql`
  mutation DeleteDepartement($id: Int!) {
    deleteDepartement(id: $id)
  }
`;

const EXPORT_DEPARTEMENTS = gql`
  query ExportDepartements {
    exportDepartements
  }
`;

@Component({
  templateUrl: "./departement.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartementComponent extends EntiteSimpleComponent<DepartementWithCounts> {
  constructor(
    private apollo: Apollo,
    private statusMessageService: StatusMessageService,
    dialog: MatDialog,
    exportService: ExportService,
    router: Router
  ) {
    super(dialog, exportService, router);
  }

  @ViewChild(DepartementTableComponent)
  private tableComponent!: DepartementTableComponent;

  getDeleteMutation(entity: DepartementWithCounts): Observable<number | null> {
    return this.apollo.mutate<DeleteDepartementMutationResult, MutationDeleteDepartementArgs>({
      mutation: DELETE_DEPARTEMENT,
      variables: {
        id: entity?.id
      }
    }).pipe(
      map(({ data }) => data?.deleteDepartement)
    );
  }

  handleEntityDeletionResult(id: number | null): void {
    if (id) {
      void this.tableComponent.updateEntities();
      this.statusMessageService.showSuccessMessage("Le département a été supprimé avec succès.");
    } else {
      this.statusMessageService.showErrorMessage("Une erreur est survenue pendant la suppression.");
    }
  }

  public exportDepartements = (): void => {
    this.apollo.query<ExportDepartementsResult>({
      query: EXPORT_DEPARTEMENTS,
      fetchPolicy: "network-only"
    }).subscribe(({ data }) => {
      if (data?.exportDepartements) {
        downloadFile(DOWNLOAD_PATH + data?.exportDepartements, this.getEntityName() + EXCEL_FILE_EXTENSION);
      }
    })
  }

  public getEntityName(): string {
    return "departement";
  }

  public getDeleteMessage(departement: DepartementWithCounts): string {
    return `Êtes-vous certain de vouloir supprimer le département ${departement.code} ? Toutes les communes (${departement.nbCommunes}), tous les lieux-dits (${departement.nbLieuxDits}) et toutes les données (${departement.nbDonnees}) avec ce département seront supprimés.`;
  }
}
