import { Component } from "@angular/core";
import { Espece } from "../../../model/espece.object";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
    templateUrl: "./espece.tpl.html"
})
export class EspeceComponent extends EntiteSimpleComponent<Espece> {

    getEntityName(): string {
        return "espece";
    }

    getNewObject(): Espece {
        return new Espece();
    }
}
