import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { SexeWithCounts } from "src/app/model/graphql";
import { BackendApiService } from "src/app/services/backend-api.service";
import { ExportService } from "src/app/services/export.service";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
  templateUrl: "./sexe.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SexeComponent extends EntiteSimpleComponent<SexeWithCounts> {
  constructor(
    dialog: MatDialog,
    backendApiService: BackendApiService,
    exportService: ExportService,
    router: Router
  ) {
    super(dialog, backendApiService, exportService, router);
  }

  getEntityName(): string {
    return "sexe";
  }

  public getDeleteMessage(sexe: SexeWithCounts): string {
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
