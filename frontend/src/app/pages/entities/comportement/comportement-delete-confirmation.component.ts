import { Component } from "@angular/core";
import { Comportement } from "../../../model/comportement.object";
import { EntiteSimpleRemovalConfirmationComponent } from "../entite-simple/entite-simple-delete-confirmation.component";

@Component({
    selector: "comportement-removal-confirmation",
    templateUrl: "./comportement-delete-confirmation.tpl.html"
})
export class ComportementRemovalConfirmationComponent extends EntiteSimpleRemovalConfirmationComponent<Comportement> {

}
