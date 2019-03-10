import { Component } from "@angular/core";
import { Age } from "../../../../model/age.object";
import { EntiteAvecLibelleTableComponent } from "../entite-avec-libelle/entite-avec-libelle-table.component";

@Component({
  selector: "age-table",
  templateUrl: "./../entite-avec-libelle/entite-avec-libelle-table.tpl.html"
})
export class AgeTableComponent extends EntiteAvecLibelleTableComponent<Age> {}
