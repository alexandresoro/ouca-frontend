import { Component } from "@angular/core";
import { EstimationNombre } from "../../../model/estimation-nombre.object";
import { EntiteSimpleDetailsComponent } from "../entite-simple/entite-simple-details.component";

@Component({
    selector: "estimation-nombre-details",
    templateUrl: "./estimation-nombre-details.tpl.html"
})
export class EstimationNombreDetailsComponent extends EntiteSimpleDetailsComponent<EstimationNombre> {
}
