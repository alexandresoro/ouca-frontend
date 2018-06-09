import { Component } from "@angular/core";
import { Lieudit } from "../../../model/lieudit.object";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
    templateUrl: "./lieudit.tpl.html"
})
export class LieuditComponent extends EntiteSimpleComponent<Lieudit> {

    getEntityName(): string {
        return "lieudit";
    }

    getNewObject(): Lieudit {
        return new Lieudit();
    }
}
