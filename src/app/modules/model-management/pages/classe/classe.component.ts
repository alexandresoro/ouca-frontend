import { ChangeDetectionStrategy, Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ClasseWithCounts, MutationDeleteClasseArgs } from "src/app/model/graphql";
import { ExportService } from "src/app/services/export.service";
import { StatusMessageService } from "src/app/services/status-message.service";
import { ClasseTableComponent } from "../../components/table/classe-table/classe-table.component";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

type DeleteClasseMutationResult = {
  deleteClasse: number | null
}

const DELETE_CLASSE = gql`
  mutation DeleteClasse($id: Int!) {
    deleteClasse(id: $id)
  }
`;

@Component({
  templateUrl: "./classe.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClasseComponent extends EntiteSimpleComponent<ClasseWithCounts> {
  constructor(
    private apollo: Apollo,
    private statusMessageService: StatusMessageService,
    dialog: MatDialog,
    exportService: ExportService,
    router: Router
  ) {
    super(dialog, exportService, router);
  }

  @ViewChild(ClasseTableComponent)
  private tableComponent!: ClasseTableComponent;

  getDeleteMutation(entity: ClasseWithCounts): Observable<number | null> {
    return this.apollo.mutate<DeleteClasseMutationResult, MutationDeleteClasseArgs>({
      mutation: DELETE_CLASSE,
      variables: {
        id: entity?.id
      }
    }).pipe(
      map(({ data }) => data?.deleteClasse)
    );
  }

  handleEntityDeletionResult(id: number | null): void {
    if (id) {
      void this.tableComponent.updateEntities();
      this.statusMessageService.showSuccessMessage("La classe a été supprimée avec succès.");
    } else {
      this.statusMessageService.showErrorMessage("Une erreur est survenue pendant la suppression.");
    }
  }

  public getEntityName(): string {
    return "classe";
  }

  public getDeleteMessage(classe: ClasseWithCounts): string {
    return `Êtes-vous certain de vouloir supprimer la classe ${classe.libelle} ? Toutes les espèces (${classe.nbEspeces}) et toutes les données (${classe.nbDonnees}) avec cette classe seront supprimées.`;
  }
}
