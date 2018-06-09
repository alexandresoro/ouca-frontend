import { Component } from "@angular/core";
import { Espece } from "../../../model/espece.object";
import { EntiteSimpleRemovalConfirmationComponent } from "../entite-simple/entite-simple-delete-confirmation.component";

@Component({
    selector: "espece-removal-confirmation",
    templateUrl: "./espece-delete-confirmation.tpl.html"
})
export class EspeceRemovalConfirmationComponent extends EntiteSimpleRemovalConfirmationComponent<Espece> {

}
