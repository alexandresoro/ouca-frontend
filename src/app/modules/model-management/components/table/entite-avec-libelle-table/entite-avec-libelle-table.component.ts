import { Component } from "@angular/core";
import { EntiteAvecLibelle } from "../../../pages/entite-avec-libelle/entite-avec-libelle-edit.component";
import { EntiteTableComponent } from "../entite-table/entite-table.component";

@Component({
  template: ""
})
export abstract class EntiteAvecLibelleTableComponent<
  T extends EntiteAvecLibelle,
  QR
  > extends EntiteTableComponent<T, QR> {
  public displayedColumns: string[] = [
    "libelle",
    "nbDonnees",
    "actions"
  ];
}
