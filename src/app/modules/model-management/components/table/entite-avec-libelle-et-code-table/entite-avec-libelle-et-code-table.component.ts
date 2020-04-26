import { Component } from "@angular/core";
import { EntiteAvecLibelleEtCode } from "ouca-common/entite-avec-libelle-et-code.object";
import { EntiteSimpleTableComponent } from "../entite-simple-table/entite-simple-table.component";

@Component({
  template: ""
})
export abstract class EntiteAvecLibelleEtCodeTableComponent<
  T extends EntiteAvecLibelleEtCode
> extends EntiteSimpleTableComponent<T> {
  public displayedColumns: string[] = ["code", "libelle", "nbDonnees"];
}
