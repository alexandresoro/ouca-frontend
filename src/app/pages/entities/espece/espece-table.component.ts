import { Component } from "@angular/core";
import { Espece } from "../../../model/espece.object";
import { EntiteSimpleTableComponent } from "../entite-simple/entite-simple-table.component";

@Component({
    selector: "espece-table",
    templateUrl: "./espece-table.tpl.html"
})
export class EspeceTableComponent extends EntiteSimpleTableComponent<Espece> {
}
