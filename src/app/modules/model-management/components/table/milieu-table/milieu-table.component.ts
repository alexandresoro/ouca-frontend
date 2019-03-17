import { Component } from "@angular/core";
import { Milieu } from "basenaturaliste-model/milieu.object";
import { EntiteAvecLibelleEtCodeTableComponent } from "../entite-avec-libelle-et-code-table/entite-avec-libelle-et-code-table.component";

@Component({
  selector: "milieu-table",
  templateUrl:
    "../entite-avec-libelle-et-code-table/entite-avec-libelle-et-code-table.tpl.html"
})
export class MilieuTableComponent extends EntiteAvecLibelleEtCodeTableComponent<
  Milieu
> {}
