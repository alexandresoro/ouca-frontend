import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Classe } from "@ou-ca/ouca-model";
import { Observable } from "rxjs";
import { EntitiesStoreService } from "src/app/services/entities-store.service";
import { ExportService } from "src/app/services/export.service";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
  templateUrl: "./classe.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClasseComponent extends EntiteSimpleComponent<Classe> {
  constructor(
    dialog: MatDialog,
    entitiesStoreService: EntitiesStoreService,
    exportService: ExportService,
    router: Router
  ) {
    super(dialog, entitiesStoreService, exportService, router);
  }

  public getEntities$ = (): Observable<Classe[]> => {
    return this.entitiesStoreService.getClasses$();
  };

  public getEntityName(): string {
    return "classe";
  }

  public getDeleteMessage(classe: Classe): string {
    return (
      "Êtes-vous certain de vouloir supprimer la classe " +
      classe.libelle +
      " ? " +
      "Toutes les espèces (" +
      classe.nbEspeces +
      ") et toutes les données (" +
      classe.nbDonnees +
      ") avec cette classe seront supprimées."
    );
  }
}
