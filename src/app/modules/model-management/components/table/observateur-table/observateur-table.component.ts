import { Component } from "@angular/core";
import { Observateur } from "basenaturaliste-model/observateur.object";
import { EntiteAvecLibelleTableComponent } from "../entite-avec-libelle-table/entite-avec-libelle-table.component";

@Component({
  selector: "observateur-table",
  templateUrl: "../entite-avec-libelle-table/entite-avec-libelle-table.tpl.html"
})
export class ObservateurTableComponent extends EntiteAvecLibelleTableComponent<
  Observateur
> {}
