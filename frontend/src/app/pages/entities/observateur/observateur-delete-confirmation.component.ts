import { Component } from "@angular/core";
import { Observateur } from "../../../model/observateur.object";
import { EntiteSimpleRemovalConfirmationComponent } from "../entite-simple/entite-simple-delete-confirmation.component";

@Component({
    selector: "observateur-removal-confirmation",
    templateUrl: "./observateur-delete-confirmation.tpl.html"
})
export class ObservateurRemovalConfirmationComponent extends EntiteSimpleRemovalConfirmationComponent<Observateur> {

}
