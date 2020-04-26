import { Component } from "@angular/core";
import { Departement } from "ouca-common/departement.object";
import { Observable } from "rxjs";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";
import { MatDialog } from "@angular/material/dialog";
import { EntitiesStoreService } from "src/app/services/entities-store.service";
import { ExportService } from "src/app/services/export.service";
import { Router } from "@angular/router";

@Component({
  templateUrl: "./departement.component.html"
})
export class DepartementComponent extends EntiteSimpleComponent<Departement> {
  constructor(
    dialog: MatDialog,
    entitiesStoreService: EntitiesStoreService,
    exportService: ExportService,
    router: Router
  ) {
    super(dialog, entitiesStoreService, exportService, router);
  }

  public getEntities$ = (): Observable<Departement[]> => {
    return this.entitiesStoreService.getDepartements$();
  };

  public getEntityName(): string {
    return "departement";
  }

  public getDeleteMessage(departement: Departement): string {
    return (
      "Êtes-vous certain de vouloir supprimer le département " +
      departement.code +
      " ? " +
      "Toutes les communes (" +
      departement.nbCommunes +
      "), tous les lieux-dits (" +
      departement.nbLieuxdits +
      ") et toutes les données (" +
      departement.nbDonnees +
      ") avec ce département seront supprimés."
    );
  }
}
