import { Component } from "@angular/core";
import { Lieudit } from "../../../model/lieudit.object";
import { EntiteSimpleTableComponent } from "../entite-simple/entite-simple-table.component";

@Component({
    selector: "lieudit-table",
    templateUrl: "./lieudit-table.tpl.html"
})
export class LieuditTableComponent extends EntiteSimpleTableComponent<Lieudit> {
}
