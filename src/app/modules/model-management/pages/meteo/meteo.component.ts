import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { MeteoWithCounts } from "src/app/model/graphql";
import { EntitiesStoreService } from "src/app/services/entities-store.service";
import { ExportService } from "src/app/services/export.service";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
  templateUrl: "./meteo.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeteoComponent extends EntiteSimpleComponent<MeteoWithCounts> {
  constructor(
    dialog: MatDialog,
    entitiesStoreService: EntitiesStoreService,
    exportService: ExportService,
    router: Router
  ) {
    super(dialog, entitiesStoreService, exportService, router);
  }

  getEntityName(): string {
    return "meteo";
  }

  public getDeleteMessage(meteo: MeteoWithCounts): string {
    return (
      "Êtes-vous certain de vouloir supprimer la météo " +
      meteo.libelle +
      " ? " +
      meteo.nbDonnees +
      " données ont cette météo."
    );
  }
}
