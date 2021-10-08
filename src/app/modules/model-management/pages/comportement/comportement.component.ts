import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ComportementWithCounts } from "src/app/model/graphql";
import { BackendApiService } from "src/app/services/backend-api.service";
import { ExportService } from "src/app/services/export.service";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";
@Component({
  templateUrl: "./comportement.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComportementComponent extends EntiteSimpleComponent<ComportementWithCounts> {
  constructor(
    dialog: MatDialog,
    backendApiService: BackendApiService,
    exportService: ExportService,
    router: Router
  ) {
    super(dialog, backendApiService, exportService, router);
  }

  getEntityName(): string {
    return "comportement";
  }

  public getDeleteMessage(comportement: ComportementWithCounts): string {
    return (
      "Êtes-vous certain de vouloir supprimer le comportement " +
      comportement.libelle +
      " ? " +
      comportement.nbDonnees +
      " données ont ce comportement."
    );
  }
}
