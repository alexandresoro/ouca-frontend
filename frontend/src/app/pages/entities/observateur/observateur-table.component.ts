import { Component } from "@angular/core";
import { Observateur } from "../../../model/observateur.object";
import { EntiteSimpleTableComponent } from "../entite-simple/entite-simple-table.component";

@Component({
    selector: "observateur-table",
    templateUrl: "./../entite-avec-libelle/entite-avec-libelle-table.tpl.html"
})
export class ObservateurTableComponent extends EntiteSimpleTableComponent<Observateur> {
}
