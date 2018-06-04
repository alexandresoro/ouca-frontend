import { Component } from "@angular/core";
import { EstimationDistance } from "../../../model/estimation-distance.object";
import { EntiteSimpleDetailsComponent } from "../entite-simple/entite-simple-details.component";

@Component({
    selector: "estimation-distance-details",
    templateUrl: "./../entite-avec-libelle/entite-avec-libelle-details.tpl.html"
})
export class EstimationDistanceDetailsComponent extends EntiteSimpleDetailsComponent<EstimationDistance> {
}
