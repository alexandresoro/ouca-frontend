import { Component } from "@angular/core";
import { Milieu } from "../../../model/milieu.object";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
    templateUrl: "./milieu.tpl.html"
})
export class MilieuComponent extends EntiteSimpleComponent<Milieu> {

    getEntityName(): string {
        return "milieu";
    }

    getNewObject(): Milieu {
        return new Milieu();
    }
}
