import { Component } from "@angular/core";
import { Sexe } from "../../../model/sexe.object";
import { EntiteSimpleDetailsComponent } from "../entite-simple/entite-simple-details.component";

@Component({
    selector: "sexe-details",
    templateUrl: "./../entite-avec-libelle/entite-avec-libelle-details.tpl.html"
})
export class SexeDetailsComponent extends EntiteSimpleDetailsComponent<Sexe> {
}
