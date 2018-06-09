import { Component } from "@angular/core";
import { Espece } from "../../../model/espece.object";
import { EntiteSimpleDetailsComponent } from "../entite-simple/entite-simple-details.component";

@Component({
    selector: "espece-details",
    templateUrl: "./espece-details.tpl.html"
})
export class EspeceDetailsComponent extends EntiteSimpleDetailsComponent<Espece> {
}
