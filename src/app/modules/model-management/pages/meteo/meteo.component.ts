import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Meteo } from "@ou-ca/ouca-model";
import { Observable } from "rxjs";
import { EntitiesStoreService } from "src/app/services/entities-store.service";
import { ExportService } from "src/app/services/export.service";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
  templateUrl: "./meteo.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeteoComponent extends EntiteSimpleComponent<Meteo> {
  constructor(
    dialog: MatDialog,
    entitiesStoreService: EntitiesStoreService,
    exportService: ExportService,
    router: Router
  ) {
    super(dialog, entitiesStoreService, exportService, router);
  }

  public getEntities$ = (): Observable<Meteo[]> => {
    return this.entitiesStoreService.getMeteos$();
  };

  getEntityName(): string {
    return "meteo";
  }

  public getDeleteMessage(meteo: Meteo): string {
    return (
      "Êtes-vous certain de vouloir supprimer la météo " +
      meteo.libelle +
      " ? " +
      meteo.nbDonnees +
      " données ont cette météo."
    );
  }
}
