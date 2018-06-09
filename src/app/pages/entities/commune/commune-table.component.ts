import { Component } from "@angular/core";
import { Commune } from "../../../model/commune.object";
import { EntiteSimpleTableComponent } from "../entite-simple/entite-simple-table.component";

@Component({
    selector: "commune-table",
    templateUrl: "./commune-table.tpl.html"
})
export class CommuneTableComponent extends EntiteSimpleTableComponent<Commune> {
}
