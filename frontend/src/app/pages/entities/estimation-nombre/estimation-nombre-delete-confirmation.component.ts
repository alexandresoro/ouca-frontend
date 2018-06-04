import { Component } from "@angular/core";
import { EstimationNombre } from "../../../model/estimation-nombre.object";
import { EntiteSimpleRemovalConfirmationComponent } from "../entite-simple/entite-simple-delete-confirmation.component";

@Component({
    selector: "estimation-nombre-removal-confirmation",
    templateUrl: "./estimation-nombre-delete-confirmation.tpl.html"
})
export class EstimationNombreRemovalConfirmationComponent
    extends EntiteSimpleRemovalConfirmationComponent<EstimationNombre> {

}
