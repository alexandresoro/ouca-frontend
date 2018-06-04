import { Component } from "@angular/core";
import { Departement } from "../../../model/departement.object";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
    templateUrl: "./departement.tpl.html"
})
export class DepartementComponent extends EntiteSimpleComponent<Departement> {

    getEntityName(): string {
        return "departement";
    }

    getNewObject(): Departement {
        return new Departement();
    }
}
