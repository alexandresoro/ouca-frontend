import { ChangeDetectionStrategy, Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { CommuneWithCounts, MutationDeleteCommuneArgs } from "src/app/model/graphql";
import { ExportService } from "src/app/services/export.service";
import { StatusMessageService } from "src/app/services/status-message.service";
import { CommuneTableComponent } from "../../components/table/commune-table/commune-table.component";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

type DeleteCommuneMutationResult = {
  deleteCommune: number | null
}

const DELETE_COMMUNE = gql`
  mutation DeleteCommune($id: Int!) {
    deleteCommune(id: $id)
  }
`;


@Component({
  templateUrl: "./commune.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommuneComponent extends EntiteSimpleComponent<CommuneWithCounts> {
  constructor(
    private apollo: Apollo,
    private statusMessageService: StatusMessageService,
    dialog: MatDialog,
    exportService: ExportService,
    router: Router
  ) {
    super(dialog, exportService, router);
  }

  @ViewChild(CommuneTableComponent)
  private tableComponent!: CommuneTableComponent;

  getDeleteMutation(entity: CommuneWithCounts): Observable<number | null> {
    return this.apollo.mutate<DeleteCommuneMutationResult, MutationDeleteCommuneArgs>({
      mutation: DELETE_COMMUNE,
      variables: {
        id: entity?.id
      }
    }).pipe(
      map(({ data }) => data?.deleteCommune)
    );
  }

  handleEntityDeletionResult(id: number | null): void {
    if (id) {
      void this.tableComponent.updateEntities();
      this.statusMessageService.showSuccessMessage("La commune a été supprimée avec succès."
      );
    } else {
      this.statusMessageService.showErrorMessage("Une erreur est survenue pendant la suppression.");
    }
  }

  getEntityName(): string {
    return "commune";
  }

  public getDeleteMessage(commune: CommuneWithCounts): string {
    return `Êtes-vous certain de vouloir supprimer la commune ${commune.nom} ? Tous les lieux-dits (${commune.nbLieuxDits}) et toutes les données (${commune.nbDonnees}) avec cette commune seront supprimés.`;
  }
}
