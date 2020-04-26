import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { UIEspece } from "src/app/models/espece.model";
import { EntitiesStoreService } from "src/app/services/entities-store.service";
import { ExportService } from "src/app/services/export.service";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
  templateUrl: "./espece.component.html"
})
export class EspeceComponent extends EntiteSimpleComponent<UIEspece> {
  constructor(
    dialog: MatDialog,
    entitiesStoreService: EntitiesStoreService,
    exportService: ExportService,
    router: Router
  ) {
    super(dialog, entitiesStoreService, exportService, router);
  }

  public getEntities$ = (): Observable<UIEspece[]> => {
    return this.entitiesStoreService.getEspeces$();
  };

  getEntityName(): string {
    return "espece";
  }

  public getDeleteMessage(espece: UIEspece): string {
    return (
      "Êtes-vous certain de vouloir supprimer l'espèce " +
      espece.nomFrancais +
      " ? " +
      "Toutes les données (" +
      espece.nbDonnees +
      ") avec cette espèce seront supprimées."
    );
  }
}
