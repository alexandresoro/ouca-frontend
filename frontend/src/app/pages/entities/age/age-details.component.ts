import { Component } from "@angular/core";
import { Age } from "../../../model/age.object";
import { EntiteSimpleDetailsComponent } from "../entite-simple/entite-simple-details.component";

@Component({
    selector: "age-details",
    templateUrl: "./../entite-avec-libelle/entite-avec-libelle-details.tpl.html",
})
export class AgeDetailsComponent extends EntiteSimpleDetailsComponent<Age> {
}
