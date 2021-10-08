import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Classe } from 'src/app/model/types/classe.object';
import { BackendApiService } from "src/app/services/backend-api.service";
import { ExportService } from "src/app/services/export.service";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
  templateUrl: "./classe.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClasseComponent extends EntiteSimpleComponent<Classe> {
  constructor(
    dialog: MatDialog,
    backendApiService: BackendApiService,
    exportService: ExportService,
    router: Router
  ) {
    super(dialog, backendApiService, exportService, router);
  }

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
