import { Component } from "@angular/core";
import { EntiteAvecLibelle } from 'src/app/model/types/entite-avec-libelle.object';
import { EntiteTableComponent } from "../entite-table/entite-table.component";
import { EntitesTableDataSource } from "../entite-table/EntitesTableDataSource";

@Component({
  template: ""
})
export abstract class EntiteAvecLibelleTableComponent<
  T extends EntiteAvecLibelle,
  U extends EntitesTableDataSource<T>
  > extends EntiteTableComponent<T, U> {
  public displayedColumns: string[] = [
    "libelle",
    "nbDonnees",
    "actions"
  ];
}
