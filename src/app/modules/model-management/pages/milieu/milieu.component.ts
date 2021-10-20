import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { MilieuWithCounts, MutationDeleteMilieuArgs } from "src/app/model/graphql";
import { ExportService } from "src/app/services/export.service";
import { StatusMessageService } from "src/app/services/status-message.service";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

type DeleteMilieuMutationResult = {
  deleteMilieu: number | null
}

const DELETE_MILIEU = gql`
  mutation DeleteMilieu($id: Int!) {
    deleteMilieu(id: $id)
  }
`;

@Component({
  templateUrl: "./milieu.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MilieuComponent extends EntiteSimpleComponent<MilieuWithCounts> {
  constructor(
    private apollo: Apollo,
    private statusMessageService: StatusMessageService,
    dialog: MatDialog,
    exportService: ExportService,
    router: Router
  ) {
    super(dialog, exportService, router);
  }

  getDeleteMutation(entity: MilieuWithCounts): Observable<number | null> {
    return this.apollo.mutate<DeleteMilieuMutationResult, MutationDeleteMilieuArgs>({
      mutation: DELETE_MILIEU,
      variables: {
        id: entity?.id
      }
    }).pipe(
      map(({ data }) => data?.deleteMilieu)
    );
  }

  handleEntityDeletionResult(id: number | null): void {
    if (id) {
      this.statusMessageService.showSuccessMessage("Le milieu a été supprimé avec succès.");
    } else {
      this.statusMessageService.showErrorMessage("Une erreur est survenue pendant la suppression.");
    }
  }

  getEntityName(): string {
    return "milieu";
  }

  public getDeleteMessage(milieu: MilieuWithCounts): string {
    return `Êtes-vous certain de vouloir supprimer le milieu ${milieu.libelle} ? ${milieu.nbDonnees} données ont ce milieu.`;
  }
}
