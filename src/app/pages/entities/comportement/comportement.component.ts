import { Component } from "@angular/core";
import { Comportement } from "../../../model/comportement.object";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
    templateUrl: "./comportement.tpl.html"
})
export class ComportementComponent extends EntiteSimpleComponent<Comportement> {

    getEntityName(): string {
        return "comportement";
    }

    getNewObject(): Comportement {
        return new Comportement();
    }
}
