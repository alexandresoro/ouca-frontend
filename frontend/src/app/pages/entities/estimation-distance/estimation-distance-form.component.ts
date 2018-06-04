import { Component } from "@angular/core";
import { EstimationDistance } from "../../../model/estimation-distance.object";
import { EntiteSimpleFormComponent } from "../entite-simple/entite-simple-form.component";

@Component({
    selector: "estimation-distance-form",
    templateUrl: "./../entite-avec-libelle/entite-avec-libelle-form.tpl.html"
})
export class EstimationDistanceFormComponent extends EntiteSimpleFormComponent<EstimationDistance> {

    getNewObject(): EstimationDistance {
        return new EstimationDistance();
    }
}
