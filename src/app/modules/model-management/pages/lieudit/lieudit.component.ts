import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { BackendApiService } from "src/app/services/backend-api.service";
import { ExportService } from "src/app/services/export.service";
import { LieuDitRow } from "../../components/table/lieudit-table/LieuxDitsDataSource";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
  templateUrl: "./lieudit.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LieuditComponent extends EntiteSimpleComponent<LieuDitRow> {
  constructor(
    dialog: MatDialog,
    backendApiService: BackendApiService,
    exportService: ExportService,
    router: Router
  ) {
    super(dialog, backendApiService, exportService, router);
  }

  getEntityName(): string {
    return "lieudit";
  }

  public getDeleteMessage(lieuDit: LieuDitRow): string {
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
