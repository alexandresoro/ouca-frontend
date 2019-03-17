import { Component } from "@angular/core";
import { EntiteAvecLibelle } from "basenaturaliste-model/entite-avec-libelle.object";
import { EntiteSimpleTableComponent } from "../entite-simple-table/entite-simple-table.component";

@Component({
  template: ""
})
export class EntiteAvecLibelleTableComponent<
  T extends EntiteAvecLibelle
> extends EntiteSimpleTableComponent<T> {
  public displayedColumns: string[] = ["libelle" /*, "nbDonnees"*/];
}
