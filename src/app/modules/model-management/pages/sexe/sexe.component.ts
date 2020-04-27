import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Sexe } from "ouca-common/sexe.object";
import { Observable } from "rxjs";
import { EntitiesStoreService } from "src/app/services/entities-store.service";
import { ExportService } from "src/app/services/export.service";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
  templateUrl: "./sexe.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SexeComponent extends EntiteSimpleComponent<Sexe> {
  constructor(
    dialog: MatDialog,
    entitiesStoreService: EntitiesStoreService,
    exportService: ExportService,
    router: Router
  ) {
    super(dialog, entitiesStoreService, exportService, router);
  }

  public getEntities$ = (): Observable<Sexe[]> => {
    return this.entitiesStoreService.getSexes$();
  };

  getEntityName(): string {
    return "sexe";
  }

  public getDeleteMessage(sexe: Sexe): string {
    return (
      "Êtes-vous certain de vouloir supprimer le sexe " +
      sexe.libelle +
      " ? " +
      "Toutes les données (" +
      sexe.nbDonnees +
      ") avec ce sexe seront supprimées."
    );
  }
}
