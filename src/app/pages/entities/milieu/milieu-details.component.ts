import { Component } from "@angular/core";
import { Milieu } from "../../../model/milieu.object";
import { EntiteSimpleDetailsComponent } from "../entite-simple/entite-simple-details.component";

@Component({
    selector: "milieu-details",
    templateUrl: "./../entite-avec-libelle-et-code/entite-avec-libelle-et-code-details.tpl.html"
})
export class MilieuDetailsComponent extends EntiteSimpleDetailsComponent<Milieu> {
}
