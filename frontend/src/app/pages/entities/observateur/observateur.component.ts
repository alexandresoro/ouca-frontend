import { Component } from "@angular/core";
import { Observateur } from "../../../model/observateur.object";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
    templateUrl: "./observateur.tpl.html"
})
export class ObservateurComponent extends EntiteSimpleComponent<Observateur> {

    getEntityName(): string {
        return "observateur";
    }

    getNewObject(): Observateur {
        return new Observateur();
    }
}
