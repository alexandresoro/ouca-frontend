import { Component } from "@angular/core";
import { EstimationNombre } from "../../../model/estimation-nombre.object";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
    templateUrl: "./estimation-nombre.tpl.html"
})
export class EstimationNombreComponent extends EntiteSimpleComponent<EstimationNombre> {

    getEntityName(): string {
        return "estimation-nombre";
    }

    getNewObject(): EstimationNombre {
        return new EstimationNombre();
    }
}
