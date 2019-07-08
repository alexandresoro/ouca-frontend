import { Component } from "@angular/core";
import { Age } from "../../../../../../basenaturaliste-model/age.object";
import { EntiteAvecLibelleTableComponent } from "../entite-avec-libelle-table/entite-avec-libelle-table.component";

@Component({
  selector: "age-table",
  templateUrl: "../entite-avec-libelle-table/entite-avec-libelle-table.tpl.html"
})
export class AgeTableComponent extends EntiteAvecLibelleTableComponent<Age> {}
