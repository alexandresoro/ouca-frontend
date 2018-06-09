import { Component } from "@angular/core";
import { Departement } from "../../../model/departement.object";
import { EntiteSimpleFormComponent } from "../entite-simple/entite-simple-form.component";

@Component({
    selector: "departement-form",
    templateUrl: "./departement-form.tpl.html"
})
export class DepartementFormComponent extends EntiteSimpleFormComponent<Departement> {

    getNewObject(): Departement {
        return new Departement();
    }
}
