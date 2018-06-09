import { Component } from "@angular/core";
import { Classe } from "../../../model/classe.object";
import { EntiteSimpleDetailsComponent } from "../entite-simple/entite-simple-details.component";

@Component({
    selector: "classe-details",
    templateUrl: "./../entite-avec-libelle/entite-avec-libelle-details.tpl.html",
})
export class ClasseDetailsComponent extends EntiteSimpleDetailsComponent<Classe> {
}
