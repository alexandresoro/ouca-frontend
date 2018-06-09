import { Component } from "@angular/core";
import { Commune } from "../../../model/commune.object";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
    templateUrl: "./commune.tpl.html"
})
export class CommuneComponent extends EntiteSimpleComponent<Commune> {

    getEntityName(): string {
        return "commune";
    }

    getNewObject(): Commune {
        return new Commune();
    }
}
