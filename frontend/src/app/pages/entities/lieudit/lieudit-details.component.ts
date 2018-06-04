import { Component } from "@angular/core";
import { Lieudit } from "../../../model/lieudit.object";
import { EntiteSimpleDetailsComponent } from "../entite-simple/entite-simple-details.component";

@Component({
    selector: "lieudit-details",
    templateUrl: "./lieudit-details.tpl.html"
})
export class LieuditDetailsComponent extends EntiteSimpleDetailsComponent<Lieudit> {
}
