import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { UICommune } from "src/app/models/commune.model";
import { EntitiesStoreService } from "src/app/services/entities-store.service";
import { ExportService } from "src/app/services/export.service";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";
@Component({
  templateUrl: "./commune.component.html"
})
export class CommuneComponent extends EntiteSimpleComponent<UICommune> {
  constructor(
    dialog: MatDialog,
    entitiesStoreService: EntitiesStoreService,
    exportService: ExportService,
    router: Router
  ) {
    super(dialog, entitiesStoreService, exportService, router);
  }

  public getEntities$ = (): Observable<UICommune[]> => {
    return this.entitiesStoreService.getCommunes$();
  };

  getEntityName(): string {
    return "commune";
  }

  public getDeleteMessage(commune: UICommune): string {
    return (
      "Êtes-vous certain de vouloir supprimer la commune " +
      commune.nom +
      " ? " +
      "Tous les lieux-dits (" +
      commune.nbLieuxdits +
      ") et toutes les données (" +
      commune.nbDonnees +
      ") avec cette commune seront supprimés."
    );
  }
}
