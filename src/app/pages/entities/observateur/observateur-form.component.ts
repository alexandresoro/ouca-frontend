import { Component } from "@angular/core";
import { Observateur } from "../../../model/observateur.object";
import { EntiteSimpleFormComponent } from "../entite-simple/entite-simple-form.component";

@Component({
    selector: "observateur-form",
    templateUrl: "./../entite-avec-libelle/entite-avec-libelle-form.tpl.html"
})
export class ObservateurFormComponent extends EntiteSimpleFormComponent<Observateur> {

    getNewObject(): Observateur {
        return new Observateur();
    }
}
