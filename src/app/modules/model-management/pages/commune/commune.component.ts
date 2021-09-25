import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { CommuneWithCounts } from "src/app/model/graphql";
import { EntitiesStoreService } from "src/app/services/entities-store.service";
import { ExportService } from "src/app/services/export.service";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";
@Component({
  templateUrl: "./commune.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommuneComponent extends EntiteSimpleComponent<CommuneWithCounts> {
  constructor(
    dialog: MatDialog,
    entitiesStoreService: EntitiesStoreService,
    exportService: ExportService,
    router: Router
  ) {
    super(dialog, entitiesStoreService, exportService, router);
  }

  getEntityName(): string {
    return "commune";
  }

  public getDeleteMessage(commune: CommuneWithCounts): string {
    return (
      "Êtes-vous certain de vouloir supprimer la commune " +
      commune.nom +
      " ? " +
      "Tous les lieux-dits (" +
      commune.nbLieuxDits +
      ") et toutes les données (" +
      commune.nbDonnees +
      ") avec cette commune seront supprimés."
    );
  }
}
