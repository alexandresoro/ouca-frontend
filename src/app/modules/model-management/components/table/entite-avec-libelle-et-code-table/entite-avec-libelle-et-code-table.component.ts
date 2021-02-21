import { Component } from "@angular/core";
import { EntiteAvecLibelleEtCode } from "@ou-ca/ouca-model";
import { EntiteSimpleTableComponent } from "../entite-simple-table/entite-simple-table.component";

@Component({
  template: ""
})
export abstract class EntiteAvecLibelleEtCodeTableComponent<
  T extends EntiteAvecLibelleEtCode
  > extends EntiteSimpleTableComponent<T> {
  public displayedColumns: string[] = ["code", "libelle", "nbDonnees"];
}
