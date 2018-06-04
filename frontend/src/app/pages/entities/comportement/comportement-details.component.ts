import { Component } from "@angular/core";
import { Comportement } from "../../../model/comportement.object";
import { EntiteSimpleDetailsComponent } from "../entite-simple/entite-simple-details.component";

@Component({
    selector: "comportement-details",
    templateUrl: "./../entite-avec-libelle-et-code/entite-avec-libelle-et-code-details.tpl.html"
})
export class ComportementDetailsComponent extends EntiteSimpleDetailsComponent<Comportement> {
}
