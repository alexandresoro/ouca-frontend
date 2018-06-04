import { Component } from "@angular/core";
import { Departement } from "../../../model/departement.object";
import { EntiteSimpleDetailsComponent } from "../entite-simple/entite-simple-details.component";

@Component({
    selector: "departement-details",
    templateUrl: "./departement-details.tpl.html"
})
export class DepartementDetailsComponent extends EntiteSimpleDetailsComponent<Departement> {
}
