import { Component } from "@angular/core";
import { EstimationNombre } from "ouca-common/estimation-nombre.object";
import { Observable } from "rxjs";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";
import { MatDialog } from "@angular/material/dialog";
import { EntitiesStoreService } from "src/app/services/entities-store.service";
import { ExportService } from "src/app/services/export.service";
import { Router } from "@angular/router";

@Component({
  templateUrl: "./estimation-nombre.component.html"
})
export class EstimationNombreComponent extends EntiteSimpleComponent<
  EstimationNombre
> {
  constructor(
    dialog: MatDialog,
    entitiesStoreService: EntitiesStoreService,
    exportService: ExportService,
    router: Router
  ) {
    super(dialog, entitiesStoreService, exportService, router);
  }

  public getEntities$ = (): Observable<EstimationNombre[]> => {
    return this.entitiesStoreService.getEstimationNombres$();
  };

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
