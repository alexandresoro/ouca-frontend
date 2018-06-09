import { Component } from "@angular/core";
import { EstimationNombre } from "../../../model/estimation-nombre.object";
import { EntiteSimpleFormComponent } from "../entite-simple/entite-simple-form.component";

@Component({
    selector: "estimation-nombre-form",
    templateUrl: "./estimation-nombre-form.tpl.html"
})
export class EstimationNombreFormComponent extends EntiteSimpleFormComponent<EstimationNombre> {

    getNewObject(): EstimationNombre {
        return new EstimationNombre();
    }
}
