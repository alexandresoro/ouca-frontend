import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { EstimationDistanceWithCounts } from "src/app/model/graphql";
import { BackendApiService } from "src/app/services/backend-api.service";
import { ExportService } from "src/app/services/export.service";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
  templateUrl: "./estimation-distance.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EstimationDistanceComponent extends EntiteSimpleComponent<
EstimationDistanceWithCounts
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
    return "estimation-distance";
  }

  public getDeleteMessage(estimation: EstimationDistanceWithCounts): string {
    return (
      "Êtes-vous certain de vouloir supprimer l'estimation de la distance " +
      estimation.libelle +
      " ? " +
      estimation.nbDonnees +
      " données ont cette estimation de la distance."
    );
  }
}
