import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Milieu } from "ouca-common/milieu.object";
import { Observable } from "rxjs";
import { EntitiesStoreService } from "src/app/services/entities-store.service";
import { ExportService } from "src/app/services/export.service";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
  templateUrl: "./milieu.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MilieuComponent extends EntiteSimpleComponent<Milieu> {
  constructor(
    dialog: MatDialog,
    entitiesStoreService: EntitiesStoreService,
    exportService: ExportService,
    router: Router
  ) {
    super(dialog, entitiesStoreService, exportService, router);
  }

  public getEntities$ = (): Observable<Milieu[]> => {
    return this.entitiesStoreService.getMilieux$();
  };

  getEntityName(): string {
    return "milieu";
  }

  public getDeleteMessage(milieu: Milieu): string {
    return (
      "Êtes-vous certain de vouloir supprimer le milieu " +
      milieu.libelle +
      " ? " +
      milieu.nbDonnees +
      " données ont ce milieu."
    );
  }
}
