import { Component } from "@angular/core";
import { Sexe } from "../../../model/sexe.object";
import { EntiteSimpleFormComponent } from "../entite-simple/entite-simple-form.component";

@Component({
    selector: "sexe-form",
    templateUrl: "./../entite-avec-libelle/entite-avec-libelle-form.tpl.html"
})
export class SexeFormComponent extends EntiteSimpleFormComponent<Sexe> {

    getNewObject(): Sexe {
        return new Sexe();
    }
}
