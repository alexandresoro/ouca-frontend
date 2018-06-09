import { Component } from "@angular/core";
import { EstimationNombre } from "../../../model/estimation-nombre.object";
import { EntiteSimpleTableComponent } from "../entite-simple/entite-simple-table.component";

@Component({
    selector: "estimation-nombre-table",
    templateUrl: "./estimation-nombre-table.tpl.html"
})
export class EstimationNombreTableComponent extends EntiteSimpleTableComponent<EstimationNombre> {
}
