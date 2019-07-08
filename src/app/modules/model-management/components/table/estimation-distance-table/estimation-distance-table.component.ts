import { Component } from "@angular/core";
import { EstimationDistance } from "../../../../../../basenaturaliste-model/estimation-distance.object";
import { EntiteAvecLibelleTableComponent } from "../entite-avec-libelle-table/entite-avec-libelle-table.component";

@Component({
  selector: "estimation-distance-table",
  templateUrl: "../entite-avec-libelle-table/entite-avec-libelle-table.tpl.html"
})
export class EstimationDistanceTableComponent extends EntiteAvecLibelleTableComponent<
  EstimationDistance
> {}
