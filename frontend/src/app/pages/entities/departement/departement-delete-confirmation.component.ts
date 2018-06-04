import { Component } from "@angular/core";
import { Departement } from "../../../model/departement.object";
import { EntiteSimpleRemovalConfirmationComponent } from "../entite-simple/entite-simple-delete-confirmation.component";

@Component({
    selector: "departement-removal-confirmation",
    templateUrl: "./departement-delete-confirmation.tpl.html"
})
export class DepartementRemovalConfirmationComponent extends EntiteSimpleRemovalConfirmationComponent<Departement> {

}
