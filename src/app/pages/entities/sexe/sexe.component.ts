import { Component } from "@angular/core";
import { Sexe } from "../../../model/sexe.object";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
    templateUrl: "./sexe.tpl.html"
})
export class SexeComponent extends EntiteSimpleComponent<Sexe> {

    getEntityName(): string {
        return "sexe";
    }

    getNewObject(): Sexe {
        return new Sexe();
    }
}
