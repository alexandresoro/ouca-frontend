import { Component } from "@angular/core";
import { EntiteAvecLibelle } from "../../../../model/entite-avec-libelle.object";
import { EntiteSimpleTableComponent } from "../entite-simple/entite-simple-table.component";

@Component({
  template: ""
})
export class EntiteAvecLibelleTableComponent<
  T extends EntiteAvecLibelle
> extends EntiteSimpleTableComponent<T> {
  public displayedColumns: string[] = ["libelle" /*, "nbDonnees"*/];
}
