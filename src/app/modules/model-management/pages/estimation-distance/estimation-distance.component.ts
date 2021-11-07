import { ChangeDetectionStrategy, Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { EstimationDistanceWithCounts, MutationDeleteEstimationDistanceArgs } from "src/app/model/graphql";
import { downloadFile } from "src/app/modules/shared/helpers/file-downloader.helper";
import { DOWNLOAD_PATH, EXCEL_FILE_EXTENSION } from "src/app/modules/shared/helpers/utils";
import { StatusMessageService } from "src/app/services/status-message.service";
import { EstimationDistanceTableComponent } from "../../components/table/estimation-distance-table/estimation-distance-table.component";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

type DeleteEstimationDistanceMutationResult = {
  deleteEstimationDistance: number | null
}

type ExportEstimationsDistanceResult = {
  exportEstimationsDistance: string | null
}

const DELETE_ESTIMATION_DISTANCE = gql`
  mutation DeleteEstimationDistance($id: Int!) {
    deleteEstimationDistance(id: $id)
  }
`;

const EXPORT_ESTIMATIONS_DISTANCE = gql`
  query ExportEstimationsDistance {
    exportEstimationsDistance
  }
`;

@Component({
  templateUrl: "./estimation-distance.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EstimationDistanceComponent extends EntiteSimpleComponent<
EstimationDistanceWithCounts
> {
  constructor(
    private apollo: Apollo,
    private statusMessageService: StatusMessageService,
    dialog: MatDialog,
    router: Router
  ) {
    super(dialog, router);
  }

  @ViewChild(EstimationDistanceTableComponent)
  private tableComponent!: EstimationDistanceTableComponent;


  getDeleteMutation(entity: EstimationDistanceWithCounts): Observable<number | null> {
    return this.apollo.mutate<DeleteEstimationDistanceMutationResult, MutationDeleteEstimationDistanceArgs>({
      mutation: DELETE_ESTIMATION_DISTANCE,
      variables: {
        id: entity?.id
      }
    }).pipe(
      map(({ data }) => data?.deleteEstimationDistance)
    );
  }

  handleEntityDeletionResult(id: number | null): void {
    if (id) {
      void this.tableComponent.updateEntities();
      this.statusMessageService.showSuccessMessage("L'estimation de la distance a été supprimée avec succès.");
    } else {
      this.statusMessageService.showErrorMessage("Une erreur est survenue pendant la suppression.");
    }
  }

  public exportEstimationsDistance = (): void => {
    this.apollo.query<ExportEstimationsDistanceResult>({
      query: EXPORT_ESTIMATIONS_DISTANCE,
      fetchPolicy: "network-only"
    }).subscribe(({ data }) => {
      if (data?.exportEstimationsDistance) {
        downloadFile(DOWNLOAD_PATH + data?.exportEstimationsDistance, this.getEntityName() + EXCEL_FILE_EXTENSION);
      }
    })
  }

  getEntityName(): string {
    return "estimation-distance";
  }

  public getDeleteMessage(estimation: EstimationDistanceWithCounts): string {
    return `Êtes-vous certain de vouloir supprimer l'estimation de la distance ${estimation.libelle} ? ${estimation.nbDonnees} données ont cette estimation de la distance.`;
  }
}
