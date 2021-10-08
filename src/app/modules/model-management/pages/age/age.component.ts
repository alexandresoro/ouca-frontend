import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { AgeWithCounts } from "src/app/model/graphql";
import { BackendApiService } from "src/app/services/backend-api.service";
import { ExportService } from "src/app/services/export.service";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
  templateUrl: "./age.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgeComponent extends EntiteSimpleComponent<AgeWithCounts> {
  constructor(
    dialog: MatDialog,
    backendApiService: BackendApiService,
    exportService: ExportService,
    router: Router
  ) {
    super(dialog, backendApiService, exportService, router);
  }

  public getEntityName(): string {
    return "age";
  }

  public getDeleteMessage(age: AgeWithCounts): string {
    return (
      "Êtes-vous certain de vouloir supprimer l'âge " +
      age.libelle +
      " ? " +
      "Toutes les données (" +
      age.nbDonnees +
      ") avec cet âge seront supprimées."
    );
  }
}
