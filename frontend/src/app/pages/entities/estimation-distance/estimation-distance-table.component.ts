import { Component } from "@angular/core";
import { EntiteSimpleTableComponent } from "../entite-simple/entite-simple-table.component";
import { EstimationDistance } from "./../../../model/estimation-distance.object";

@Component({
    selector: "estimation-distance-table",
    templateUrl: "./../entite-avec-libelle/entite-avec-libelle-table.tpl.html"
})
export class EstimationDistanceTableComponent extends EntiteSimpleTableComponent<EstimationDistance> {
}
