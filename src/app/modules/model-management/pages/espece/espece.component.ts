import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { EspeceWithCounts, MutationDeleteEspeceArgs } from "src/app/model/graphql";
import { ExportService } from "src/app/services/export.service";
import { StatusMessageService } from "src/app/services/status-message.service";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

type DeleteEspeceMutationResult = {
  deleteEspece: number | null
}

const DELETE_ESPECE = gql`
  mutation DeleteEspece($id: Int!) {
    deleteEspece(id: $id)
  }
`;

@Component({
  templateUrl: "./espece.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EspeceComponent extends EntiteSimpleComponent<EspeceWithCounts> {
  constructor(
    private apollo: Apollo,
    private statusMessageService: StatusMessageService,
    dialog: MatDialog,
    exportService: ExportService,
    router: Router
  ) {
    super(dialog, exportService, router);
  }

  getDeleteMutation(entity: EspeceWithCounts): Observable<number | null> {
    return this.apollo.mutate<DeleteEspeceMutationResult, MutationDeleteEspeceArgs>({
      mutation: DELETE_ESPECE,
      variables: {
        id: entity?.id
      }
    }).pipe(
      map(({ data }) => data?.deleteEspece)
    );
  }

  handleEntityDeletionResult(id: number | null): void {
    if (id) {
      this.statusMessageService.showSuccessMessage("L'espèce a été supprimée avec succès.");
    } else {
      this.statusMessageService.showErrorMessage("Une erreur est survenue pendant la suppression.");
    }
  }

  getEntityName(): string {
    return "espece";
  }

  public getDeleteMessage(espece: EspeceWithCounts): string {
    return `Êtes-vous certain de vouloir supprimer l'espèce ${espece.nomFrancais} ? Toutes les données (${espece.nbDonnees}) avec cette espèce seront supprimées.`;
  }
}
