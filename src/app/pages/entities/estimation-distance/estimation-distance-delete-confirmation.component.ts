import { Component } from "@angular/core";
import { EstimationDistance } from "../../../model/estimation-distance.object";
import { EntiteSimpleRemovalConfirmationComponent } from "../entite-simple/entite-simple-delete-confirmation.component";

@Component({
    selector: "estimation-distance-removal-confirmation",
    templateUrl: "./estimation-distance-delete-confirmation.tpl.html"
})
export class EstimationDistanceRemovalConfirmationComponent
    extends EntiteSimpleRemovalConfirmationComponent<EstimationDistance> {

}
