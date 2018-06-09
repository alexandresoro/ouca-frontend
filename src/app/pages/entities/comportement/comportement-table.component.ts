import { Component } from "@angular/core";
import { Comportement } from "../../../model/comportement.object";
import { EntiteSimpleTableComponent } from "../entite-simple/entite-simple-table.component";

@Component({
    selector: "comportement-table",
    templateUrl: "./../entite-avec-libelle-et-code/entite-avec-libelle-et-code-table.tpl.html"
})
export class ComportementTableComponent extends EntiteSimpleTableComponent<Comportement> {
}
