import { Component } from "@angular/core";
import { EstimationDistance } from "../../../../model/estimation-distance.object";
import { EntiteAvecLibelleTableComponent } from "../entite-avec-libelle/entite-avec-libelle-table.component";

@Component({
  selector: "estimation-distance-table",
  templateUrl: "./../entite-avec-libelle/entite-avec-libelle-table.tpl.html"
})
export class EstimationDistanceTableComponent extends EntiteAvecLibelleTableComponent<
  EstimationDistance
> {}
