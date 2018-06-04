import { Component } from "@angular/core";
import { Milieu } from "../../../model/milieu.object";
import { EntiteSimpleFormComponent } from "../entite-simple/entite-simple-form.component";

@Component({
    selector: "milieu-form",
    templateUrl: "./../entite-avec-libelle-et-code/entite-avec-libelle-et-code-form.tpl.html"
})
export class MilieuFormComponent extends EntiteSimpleFormComponent<Milieu> {

    getNewObject(): Milieu {
        return new Milieu();
    }
}
