import { Component } from "@angular/core";
import { Lieudit } from "../../../model/lieudit.object";
import { EntiteSimpleRemovalConfirmationComponent } from "../entite-simple/entite-simple-delete-confirmation.component";

@Component({
    selector: "lieudit-removal-confirmation",
    templateUrl: "./lieudit-delete-confirmation.tpl.html"
})
export class LieuditRemovalConfirmationComponent extends EntiteSimpleRemovalConfirmationComponent<Lieudit> {

}
