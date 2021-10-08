import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { EspeceWithCounts } from "src/app/model/graphql";
import { BackendApiService } from "src/app/services/backend-api.service";
import { ExportService } from "src/app/services/export.service";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
  templateUrl: "./espece.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EspeceComponent extends EntiteSimpleComponent<EspeceWithCounts> {
  constructor(
    dialog: MatDialog,
    backendApiService: BackendApiService,
    exportService: ExportService,
    router: Router
  ) {
    super(dialog, backendApiService, exportService, router);
  }

  getEntityName(): string {
    return "espece";
  }

  public getDeleteMessage(espece: EspeceWithCounts): string {
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
