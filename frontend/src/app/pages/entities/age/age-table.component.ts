import { Component } from "@angular/core";
import { Age } from "../../../model/age.object";
import { EntiteSimpleTableComponent } from "../entite-simple/entite-simple-table.component";

@Component({
    selector: "age-table",
    templateUrl: "./../entite-avec-libelle/entite-avec-libelle-table.tpl.html",
})
export class AgeTableComponent extends EntiteSimpleTableComponent<Age> {
}
