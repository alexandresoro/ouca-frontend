import { Component } from "@angular/core";
import { Comportement } from "../../../model/comportement.object";
import { EntiteSimpleFormComponent } from "../entite-simple/entite-simple-form.component";

@Component({
    selector: "comportement-form",
    templateUrl: "./../entite-avec-libelle-et-code/entite-avec-libelle-et-code-form.tpl.html"
})
export class ComportementFormComponent extends EntiteSimpleFormComponent<Comportement> {

    getNewObject(): Comportement {
        return new Comportement();
    }
}
