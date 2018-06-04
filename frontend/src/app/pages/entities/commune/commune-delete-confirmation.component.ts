import { Component } from "@angular/core";
import { Commune } from "../../../model/commune.object";
import { EntiteSimpleRemovalConfirmationComponent } from "../entite-simple/entite-simple-delete-confirmation.component";

@Component({
    selector: "commune-removal-confirmation",
    templateUrl: "./commune-delete-confirmation.tpl.html"
})
export class CommuneRemovalConfirmationComponent extends EntiteSimpleRemovalConfirmationComponent<Commune> {

}
