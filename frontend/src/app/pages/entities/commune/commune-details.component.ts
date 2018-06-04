import { Component } from "@angular/core";
import { Commune } from "../../../model/commune.object";
import { EntiteSimpleDetailsComponent } from "../entite-simple/entite-simple-details.component";

@Component({
    selector: "commune-details",
    templateUrl: "./commune-details.tpl.html"
})
export class CommuneDetailsComponent extends EntiteSimpleDetailsComponent<Commune> {
}
