import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AgeWithCounts, MutationDeleteAgeArgs } from "src/app/model/graphql";
import { ExportService } from "src/app/services/export.service";
import { StatusMessageService } from "src/app/services/status-message.service";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

type DeleteAgeMutationResult = {
  deleteAge: number | null
}

const DELETE_AGE = gql`
  mutation DeleteAge($id: Int!) {
    deleteAge(id: $id)
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
    exportService: ExportService,
    router: Router
  ) {
    super(dialog, exportService, router);
  }

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
      this.statusMessageService.showSuccessMessage("L'âge a été supprimé avec succès.");
    } else {
      this.statusMessageService.showErrorMessage("Une erreur est survenue pendant la suppression.");
    }
  }

  public getEntityName(): string {
    return "age";
  }

  public getDeleteMessage(age: AgeWithCounts): string {
    return `Êtes-vous certain de vouloir supprimer l'âge ${age.libelle} ? Toutes les données (${age.nbDonnees}) avec cet âge seront supprimées.`;
  }
}
