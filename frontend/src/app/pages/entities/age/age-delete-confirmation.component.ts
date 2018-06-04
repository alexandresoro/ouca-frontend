import { Component } from "@angular/core";
import { Age } from "../../../model/age.object";
import { EntiteSimpleRemovalConfirmationComponent } from "../entite-simple/entite-simple-delete-confirmation.component";

@Component({
    selector: "age-removal-confirmation",
    templateUrl: "./age-delete-confirmation.tpl.html",
})
export class AgeRemovalConfirmationComponent extends EntiteSimpleRemovalConfirmationComponent<Age> {

}
