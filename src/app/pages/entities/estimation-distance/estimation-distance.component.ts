import { Component } from "@angular/core";
import { EstimationDistance } from "../../../model/estimation-distance.object";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
    templateUrl: "./estimation-distance.tpl.html"
})
export class EstimationDistanceComponent extends EntiteSimpleComponent<EstimationDistance> {

    getEntityName(): string {
        return "estimation-distance";
    }

    getNewObject(): EstimationDistance {
        return new EstimationDistance();
    }
}
