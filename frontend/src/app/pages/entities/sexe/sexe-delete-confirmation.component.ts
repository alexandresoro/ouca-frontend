import { Component } from "@angular/core";
import { Sexe } from "../../../model/sexe.object";
import { EntiteSimpleRemovalConfirmationComponent } from "../entite-simple/entite-simple-delete-confirmation.component";

@Component({
    selector: "sexe-removal-confirmation",
    templateUrl: "./sexe-delete-confirmation.tpl.html"
})
export class SexeRemovalConfirmationComponent extends EntiteSimpleRemovalConfirmationComponent<Sexe> {

}
