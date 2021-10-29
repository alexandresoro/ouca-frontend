import { Component } from "@angular/core";
import { EntiteAvecLibelle } from 'src/app/model/types/entite-avec-libelle.object';
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
