import { Component } from "@angular/core";
import { Age } from "../../../model/age.object";
import { EntiteSimpleFormComponent } from "../entite-simple/entite-simple-form.component";

@Component({
    selector: "age-form",
    templateUrl: "./../entite-avec-libelle/entite-avec-libelle-form.tpl.html",
})
export class AgeFormComponent extends EntiteSimpleFormComponent<Age> {

    public getNewObject(): Age {
        return new Age();
    }
}
