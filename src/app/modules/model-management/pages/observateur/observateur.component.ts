import { ChangeDetectionStrategy, Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { MutationDeleteObservateurArgs, ObservateurWithCounts } from "src/app/model/graphql";
import { ExportService } from "src/app/services/export.service";
import { StatusMessageService } from "src/app/services/status-message.service";
import { ObservateurTableComponent } from "../../components/table/observateur-table/observateur-table.component";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

type DeleteObservateurMutationResult = {
  deleteObservateur: number | null
}

const DELETE_OBSERVATEUR = gql`
  mutation DeleteObservateur($id: Int!) {
    deleteObservateur(id: $id)
  }
`;

@Component({
  templateUrl: "./observateur.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObservateurComponent extends EntiteSimpleComponent<ObservateurWithCounts> {
  constructor(
    private apollo: Apollo,
    private statusMessageService: StatusMessageService,
    dialog: MatDialog,
    exportService: ExportService,
    router: Router
  ) {
    super(dialog, exportService, router);
  }

  @ViewChild(ObservateurTableComponent)
  private tableComponent!: ObservateurTableComponent;

  getDeleteMutation(entity: ObservateurWithCounts): Observable<number | null> {
    return this.apollo.mutate<DeleteObservateurMutationResult, MutationDeleteObservateurArgs>({
      mutation: DELETE_OBSERVATEUR,
      variables: {
        id: entity?.id
      }
    }).pipe(
      map(({ data }) => data?.deleteObservateur)
    );
  }

  handleEntityDeletionResult(id: number | null): void {
    if (id) {
      void this.tableComponent.updateEntities();
      this.statusMessageService.showSuccessMessage("L'observateur a été supprimé avec succès.");
    } else {
      this.statusMessageService.showErrorMessage("Une erreur est survenue pendant la suppression.");
    }
  }

  public getEntityName = (): string => {
    return "observateur";
  };

  public getDeleteMessage(observateur: ObservateurWithCounts): string {
    return `Êtes-vous certain de vouloir supprimer l'observateur ${observateur.libelle} ? Toutes les données (${observateur.nbDonnees}) avec cet observateur seront supprimées.`;
  }
}
