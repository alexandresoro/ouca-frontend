import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ComportementWithCounts, MutationDeleteComportementArgs } from "src/app/model/graphql";
import { ExportService } from "src/app/services/export.service";
import { StatusMessageService } from "src/app/services/status-message.service";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

type DeleteComportementMutationResult = {
  deleteComportement: number | null
}

const DELETE_COMPORTEMENT = gql`
  mutation DeleteComportement($id: Int!) {
    deleteComportement(id: $id)
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
    exportService: ExportService,
    router: Router
  ) {
    super(dialog, exportService, router);
  }

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
      this.statusMessageService.showSuccessMessage("Le comportement a été supprimé avec succès."
      );
    } else {
      this.statusMessageService.showErrorMessage("Une erreur est survenue pendant la suppression.");
    }
  }

  getEntityName(): string {
    return "comportement";
  }

  public getDeleteMessage(comportement: ComportementWithCounts): string {
    return `Êtes-vous certain de vouloir supprimer le comportement ${comportement.libelle} ?  ${comportement.nbDonnees} données ont ce comportement.`;
  }
}
