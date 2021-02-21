import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { EstimationDistance } from "@ou-ca/ouca-model";
import { Observable } from "rxjs";
import { EntitiesStoreService } from "src/app/services/entities-store.service";
import { ExportService } from "src/app/services/export.service";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
  templateUrl: "./estimation-distance.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EstimationDistanceComponent extends EntiteSimpleComponent<
EstimationDistance
> {
  constructor(
    dialog: MatDialog,
    entitiesStoreService: EntitiesStoreService,
    exportService: ExportService,
    router: Router
  ) {
    super(dialog, entitiesStoreService, exportService, router);
  }

  public getEntities$ = (): Observable<EstimationDistance[]> => {
    return this.entitiesStoreService.getEstimationDistances$();
  };

  getEntityName(): string {
    return "estimation-distance";
  }

  public getDeleteMessage(estimation: EstimationDistance): string {
    return (
      "Êtes-vous certain de vouloir supprimer l'estimation de la distance " +
      estimation.libelle +
      " ? " +
      estimation.nbDonnees +
      " données ont cette estimation de la distance."
    );
  }
}
