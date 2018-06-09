import { Component } from "@angular/core";
import { Observateur } from "../../../model/observateur.object";
import { EntiteSimpleDetailsComponent } from "../entite-simple/entite-simple-details.component";

@Component({
    selector: "observateur-details",
    templateUrl: "./../entite-avec-libelle/entite-avec-libelle-details.tpl.html"
})
export class ObservateurDetailsComponent extends EntiteSimpleDetailsComponent<Observateur> {
}
