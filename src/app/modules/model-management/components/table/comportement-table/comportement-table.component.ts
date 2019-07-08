import { Component } from "@angular/core";
import { Comportement } from "../../../../../../basenaturaliste-model/comportement.object";
import { EntiteAvecLibelleEtCodeTableComponent } from "../entite-avec-libelle-et-code-table/entite-avec-libelle-et-code-table.component";

@Component({
  selector: "comportement-table",
  templateUrl:
    "../entite-avec-libelle-et-code-table/entite-avec-libelle-et-code-table.tpl.html"
})
export class ComportementTableComponent extends EntiteAvecLibelleEtCodeTableComponent<
  Comportement
> {}
