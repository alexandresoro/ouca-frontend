import { Component } from "@angular/core";
import { Departement } from "../../../../../model/departement.object";
import { EntiteSimpleTableComponent } from "../entite-simple-table/entite-simple-table.component";

@Component({
  selector: "departement-table",
  templateUrl: "./departement-table.tpl.html"
})
export class DepartementTableComponent extends EntiteSimpleTableComponent<
  Departement
> {
  public displayedColumns: string[] = [
    "code" /*,
    "nbCommunes",
    "nbLieuxdits",
    "nbDonnees"*/
  ];
}
