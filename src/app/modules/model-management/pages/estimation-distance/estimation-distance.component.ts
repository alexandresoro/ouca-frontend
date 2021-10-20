import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { EstimationDistanceWithCounts, MutationDeleteEstimationDistanceArgs } from "src/app/model/graphql";
import { ExportService } from "src/app/services/export.service";
import { StatusMessageService } from "src/app/services/status-message.service";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

type DeleteEstimationDistanceMutationResult = {
  deleteEstimationDistance: number | null
}

const DELETE_ESTIMATION_DISTANCE = gql`
  mutation DeleteEstimationDistance($id: Int!) {
    deleteEstimationDistance(id: $id)
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
    exportService: ExportService,
    router: Router
  ) {
    super(dialog, exportService, router);
  }

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
      this.statusMessageService.showSuccessMessage("L'estimation de la distance a été supprimée avec succès.");
    } else {
      this.statusMessageService.showErrorMessage("Une erreur est survenue pendant la suppression.");
    }
  }

  getEntityName(): string {
    return "estimation-distance";
  }

  public getDeleteMessage(estimation: EstimationDistanceWithCounts): string {
    return `Êtes-vous certain de vouloir supprimer l'estimation de la distance ${estimation.libelle} ? ${estimation.nbDonnees} données ont cette estimation de la distance.`;
  }
}
