import { Component } from "@angular/core";
import { Classe } from "../../../model/classe.object";
import { EntiteSimpleRemovalConfirmationComponent } from "../entite-simple/entite-simple-delete-confirmation.component";

@Component({
    selector: "classe-removal-confirmation",
    templateUrl: "./classe-delete-confirmation.tpl.html",
})
export class ClasseRemovalConfirmationComponent extends EntiteSimpleRemovalConfirmationComponent<Classe> {

}
