import { ChangeDetectionStrategy, Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { MeteoWithCounts, MutationDeleteMeteoArgs } from "src/app/model/graphql";
import { downloadFile } from "src/app/modules/shared/helpers/file-downloader.helper";
import { DOWNLOAD_PATH, EXCEL_FILE_EXTENSION } from "src/app/modules/shared/helpers/utils";
import { StatusMessageService } from "src/app/services/status-message.service";
import { MeteoTableComponent } from "../../components/table/meteo-table/meteo-table.component";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

type DeleteMeteoMutationResult = {
  deleteMeteo: number | null
}

type ExportMeteosResult = {
  exportMeteos: string | null
}

const DELETE_METEO = gql`
  mutation DeleteMeteo($id: Int!) {
    deleteMeteo(id: $id)
  }
`;

const EXPORT_METEOS = gql`
  query ExportMeteos {
    exportMeteos
  }
`;

@Component({
  templateUrl: "./meteo.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeteoComponent extends EntiteSimpleComponent<MeteoWithCounts> {
  constructor(
    private apollo: Apollo,
    private statusMessageService: StatusMessageService,
    dialog: MatDialog,
    router: Router
  ) {
    super(dialog, router);
  }

  @ViewChild(MeteoTableComponent)
  private tableComponent!: MeteoTableComponent;


  getDeleteMutation(entity: MeteoWithCounts): Observable<number | null> {
    return this.apollo.mutate<DeleteMeteoMutationResult, MutationDeleteMeteoArgs>({
      mutation: DELETE_METEO,
      variables: {
        id: entity?.id
      }
    }).pipe(
      map(({ data }) => data?.deleteMeteo)
    );
  }

  handleEntityDeletionResult(id: number | null): void {
    if (id) {
      void this.tableComponent.updateEntities();
      this.statusMessageService.showSuccessMessage("La météo a été supprimée avec succès.");
    } else {
      this.statusMessageService.showErrorMessage("Une erreur est survenue pendant la suppression.");
    }
  }

  public exportMeteos = (): void => {
    this.apollo.query<ExportMeteosResult>({
      query: EXPORT_METEOS,
      fetchPolicy: "network-only"
    }).subscribe(({ data }) => {
      if (data?.exportMeteos) {
        downloadFile(DOWNLOAD_PATH + data?.exportMeteos, this.getEntityName() + EXCEL_FILE_EXTENSION);
      }
    })
  }

  getEntityName(): string {
    return "meteo";
  }

  public getDeleteMessage(meteo: MeteoWithCounts): string {
    return `Êtes-vous certain de vouloir supprimer la météo ${meteo.libelle} ? ${meteo.nbDonnees} données ont cette météo.`;
  }
}
