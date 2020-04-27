import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Observateur } from "ouca-common/observateur.object";
import { Observable } from "rxjs";
import { EntitiesStoreService } from "src/app/services/entities-store.service";
import { ExportService } from "src/app/services/export.service";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";
@Component({
  templateUrl: "./observateur.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObservateurComponent extends EntiteSimpleComponent<Observateur> {
  constructor(
    dialog: MatDialog,
    entitiesStoreService: EntitiesStoreService,
    exportService: ExportService,
    router: Router
  ) {
    super(dialog, entitiesStoreService, exportService, router);
  }

  public getEntities$ = (): Observable<Observateur[]> => {
    return this.entitiesStoreService.getObservateurs$();
  };

  public getEntityName = (): string => {
    return "observateur";
  };

  public getDeleteMessage(observateur: Observateur): string {
    return (
      "Êtes-vous certain de vouloir supprimer l'observateur " +
      observateur.libelle +
      " ? " +
      "Toutes les données (" +
      observateur.nbDonnees +
      ") avec cet observateur seront supprimées."
    );
  }
}
