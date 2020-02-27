import { Component } from "@angular/core";
import { Milieu } from "ouca-common/milieu.object";
import { EntiteAvecLibelleEtCodeTableComponent } from "../entite-avec-libelle-et-code-table/entite-avec-libelle-et-code-table.component";

@Component({
  selector: "milieu-table",
  styleUrls: [
    "../entite-avec-libelle-et-code-table/entite-avec-libelle-et-code-table.component.scss"
  ],
  templateUrl:
    "../entite-avec-libelle-et-code-table/entite-avec-libelle-et-code-table.tpl.html"
})
export class MilieuTableComponent extends EntiteAvecLibelleEtCodeTableComponent<
  Milieu
> {}
