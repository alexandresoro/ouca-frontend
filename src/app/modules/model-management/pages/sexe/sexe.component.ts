import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { MutationDeleteSexeArgs, SexeWithCounts } from "src/app/model/graphql";
import { ExportService } from "src/app/services/export.service";
import { StatusMessageService } from "src/app/services/status-message.service";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

type DeleteSexeMutationResult = {
  deleteSexe: number | null
}

const DELETE_SEXE = gql`
  mutation DeleteSexe($id: Int!) {
    deleteSexe(id: $id)
  }
`;

@Component({
  templateUrl: "./sexe.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SexeComponent extends EntiteSimpleComponent<SexeWithCounts> {
  constructor(
    private apollo: Apollo,
    private statusMessageService: StatusMessageService,
    dialog: MatDialog,
    exportService: ExportService,
    router: Router
  ) {
    super(dialog, exportService, router);
  }

  getDeleteMutation(entity: SexeWithCounts): Observable<number | null> {
    return this.apollo.mutate<DeleteSexeMutationResult, MutationDeleteSexeArgs>({
      mutation: DELETE_SEXE,
      variables: {
        id: entity?.id
      }
    }).pipe(
      map(({ data }) => data?.deleteSexe)
    );
  }

  handleEntityDeletionResult(id: number | null): void {
    if (id) {
      this.statusMessageService.showSuccessMessage("Le sexe a été supprimé avec succès.");
    } else {
      this.statusMessageService.showErrorMessage("Une erreur est survenue pendant la suppression.");
    }
  }

  getEntityName(): string {
    return "sexe";
  }

  public getDeleteMessage(sexe: SexeWithCounts): string {
    return `Êtes-vous certain de vouloir supprimer le sexe ${sexe.libelle} ? Toutes les données (${sexe.nbDonnees}) avec ce sexe seront supprimées.`;
  }
}
