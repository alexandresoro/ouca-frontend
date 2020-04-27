import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { UILieudit } from "src/app/models/lieudit.model";
import { EntitiesStoreService } from "src/app/services/entities-store.service";
import { ExportService } from "src/app/services/export.service";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
  templateUrl: "./lieudit.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LieuditComponent extends EntiteSimpleComponent<UILieudit> {
  constructor(
    dialog: MatDialog,
    entitiesStoreService: EntitiesStoreService,
    exportService: ExportService,
    router: Router
  ) {
    super(dialog, entitiesStoreService, exportService, router);
  }

  public getEntities$ = (): Observable<UILieudit[]> => {
    return this.entitiesStoreService.getLieuxdits$();
  };

  getEntityName(): string {
    return "lieudit";
  }

  public getDeleteMessage(lieuDit: UILieudit): string {
    return (
      "Êtes-vous certain de vouloir supprimer le lieu-dit " +
      lieuDit.nom +
      " ? " +
      "Toutes les données (" +
      lieuDit.nbDonnees +
      ") avec ce lieu-dit seront supprimées."
    );
  }
}
