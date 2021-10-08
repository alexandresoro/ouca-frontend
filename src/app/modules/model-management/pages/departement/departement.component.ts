import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { DepartementWithCounts } from "src/app/model/graphql";
import { BackendApiService } from "src/app/services/backend-api.service";
import { ExportService } from "src/app/services/export.service";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
  templateUrl: "./departement.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartementComponent extends EntiteSimpleComponent<DepartementWithCounts> {
  constructor(
    dialog: MatDialog,
    backendApiService: BackendApiService,
    exportService: ExportService,
    router: Router
  ) {
    super(dialog, backendApiService, exportService, router);
  }

  public getEntityName(): string {
    return "departement";
  }

  public getDeleteMessage(departement: DepartementWithCounts): string {
    return (
      "Êtes-vous certain de vouloir supprimer le département " +
      departement.code +
      " ? " +
      "Toutes les communes (" +
      departement.nbCommunes +
      "), tous les lieux-dits (" +
      departement.nbLieuxDits +
      ") et toutes les données (" +
      departement.nbDonnees +
      ") avec ce département seront supprimés."
    );
  }
}
