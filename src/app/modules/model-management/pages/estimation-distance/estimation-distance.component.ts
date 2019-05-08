import { Component } from "@angular/core";
import { EstimationDistance } from "basenaturaliste-model/estimation-distance.object";
import { EntiteAvecLibelleComponent } from "../entite-avec-libelle/entite-avec-libelle.component";

@Component({
  templateUrl: "./estimation-distance.tpl.html"
})
export class EstimationDistanceComponent extends EntiteAvecLibelleComponent<
  EstimationDistance
> {
  getEntityName(): string {
    return "estimation-distance";
  }

  public getAnEntityLabel(): string {
    return "une estimation de la distance";
  }

  getNewObject(): EstimationDistance {
    return {} as EstimationDistance;
  }
}
