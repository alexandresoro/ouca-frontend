import { Component } from "@angular/core";
import { Sexe } from "ouca-common/sexe.object";
import { EntiteAvecLibelleTableComponent } from "../entite-avec-libelle-table/entite-avec-libelle-table.component";

@Component({
  selector: "sexe-table",
  styleUrls: [
    "../entite-avec-libelle-table/entite-avec-libelle-table.component.scss"
  ],
  templateUrl: "../entite-avec-libelle-table/entite-avec-libelle-table.tpl.html"
})
export class SexeTableComponent extends EntiteAvecLibelleTableComponent<Sexe> {}
