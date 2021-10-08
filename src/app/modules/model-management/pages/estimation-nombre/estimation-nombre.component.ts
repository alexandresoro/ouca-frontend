import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { EstimationNombre } from 'src/app/model/types/estimation-nombre.object';
import { BackendApiService } from "src/app/services/backend-api.service";
import { ExportService } from "src/app/services/export.service";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
  templateUrl: "./estimation-nombre.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EstimationNombreComponent extends EntiteSimpleComponent<
EstimationNombre
> {
  constructor(
    dialog: MatDialog,
    backendApiService: BackendApiService,
    exportService: ExportService,
    router: Router
  ) {
    super(dialog, backendApiService, exportService, router);
  }

  getEntityName(): string {
    return "estimation-nombre";
  }

  public getDeleteMessage(estimation: EstimationNombre): string {
    return (
      "Êtes-vous certain de vouloir supprimer l'estimation du nombre " +
      estimation.libelle +
      " ? " +
      "Toutes les données (" +
      estimation.nbDonnees +
      ") avec cette estimation du nombre seront supprimées."
    );
  }
}
