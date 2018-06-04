import { Component } from "@angular/core";
import { Milieu } from "../../../model/milieu.object";
import { EntiteSimpleRemovalConfirmationComponent } from "../entite-simple/entite-simple-delete-confirmation.component";

@Component({
    selector: "milieu-removal-confirmation",
    templateUrl: "./milieu-delete-confirmation.tpl.html"
})
export class MilieuRemovalConfirmationComponent extends EntiteSimpleRemovalConfirmationComponent<Milieu> {

}
