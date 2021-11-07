import { ChangeDetectionStrategy, Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { EstimationNombreWithCounts, MutationDeleteEstimationNombreArgs } from "src/app/model/graphql";
import { downloadFile } from "src/app/modules/shared/helpers/file-downloader.helper";
import { DOWNLOAD_PATH, EXCEL_FILE_EXTENSION } from "src/app/modules/shared/helpers/utils";
import { StatusMessageService } from "src/app/services/status-message.service";
import { EstimationNombreTableComponent } from "../../components/table/estimation-nombre-table/estimation-nombre-table.component";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

type DeleteEstimationNombreMutationResult = {
  deleteEstimationNombre: number | null
}

type ExportEstimationsNombreResult = {
  exportEstimationsNombre: string | null
}

const DELETE_ESTIMATION_NOMBRE = gql`
  mutation DeleteEstimationNombre($id: Int!) {
    deleteEstimationNombre(id: $id)
  }
`;

const EXPORT_ESTIMATIONS_NOMBRE = gql`
  query ExportEstimationsNombre {
    exportEstimationsNombre
  }
`;

@Component({
  templateUrl: "./estimation-nombre.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EstimationNombreComponent extends EntiteSimpleComponent<
EstimationNombreWithCounts
> {
  constructor(
    private apollo: Apollo,
    private statusMessageService: StatusMessageService,
    dialog: MatDialog,
    router: Router
  ) {
    super(dialog, router);
  }

  @ViewChild(EstimationNombreTableComponent)
  private tableComponent!: EstimationNombreTableComponent;


  getDeleteMutation(entity: EstimationNombreWithCounts): Observable<number | null> {
    return this.apollo.mutate<DeleteEstimationNombreMutationResult, MutationDeleteEstimationNombreArgs>({
      mutation: DELETE_ESTIMATION_NOMBRE,
      variables: {
        id: entity?.id
      }
    }).pipe(
      map(({ data }) => data?.deleteEstimationNombre)
    );
  }

  handleEntityDeletionResult(id: number | null): void {
    if (id) {
      void this.tableComponent.updateEntities();
      this.statusMessageService.showSuccessMessage("L'estimation du nombre a été supprimée avec succès.");
    } else {
      this.statusMessageService.showErrorMessage("Une erreur est survenue pendant la suppression.");
    }
  }

  public exportEstimationsNombre = (): void => {
    this.apollo.query<ExportEstimationsNombreResult>({
      query: EXPORT_ESTIMATIONS_NOMBRE,
      fetchPolicy: "network-only"
    }).subscribe(({ data }) => {
      if (data?.exportEstimationsNombre) {
        downloadFile(DOWNLOAD_PATH + data?.exportEstimationsNombre, this.getEntityName() + EXCEL_FILE_EXTENSION);
      }
    })
  }

  getEntityName(): string {
    return "estimation-nombre";
  }

  public getDeleteMessage(estimation: EstimationNombreWithCounts): string {
    return `Êtes-vous certain de vouloir supprimer l'estimation du nombre ${estimation.libelle} ? Toutes les données (${estimation.nbDonnees}) avec cette estimation du nombre seront supprimées.`;
  }
}
