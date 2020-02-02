import { Component } from "@angular/core";
import { Classe } from "basenaturaliste-model/classe.object";
import { EntiteAvecLibelleTableComponent } from "../entite-avec-libelle-table/entite-avec-libelle-table.component";

@Component({
  selector: "classe-table",
  styleUrls: [
    "../entite-avec-libelle-table/entite-avec-libelle-table.component.scss",
    "./classe-table.component.scss"
  ],
  templateUrl: "./classe-table.tpl.html"
})
export class ClasseTableComponent extends EntiteAvecLibelleTableComponent<
  Classe
> {
  public displayedColumns: string[] = ["libelle", "nbEspeces", "nbDonnees"];
}
