import { Component } from "@angular/core";
import { Sexe } from "../../../model/sexe.object";
import { EntiteAvecLibelleTableComponent } from "../entite-avec-libelle/entite-avec-libelle-table.component";

@Component({
  selector: "sexe-table",
  templateUrl: "./../entite-avec-libelle/entite-avec-libelle-table.tpl.html"
})
export class SexeTableComponent extends EntiteAvecLibelleTableComponent<Sexe> {}
