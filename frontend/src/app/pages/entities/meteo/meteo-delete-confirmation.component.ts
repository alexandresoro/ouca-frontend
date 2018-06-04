import { Component } from "@angular/core";
import { Meteo } from "../../../model/meteo.object";
import { EntiteSimpleRemovalConfirmationComponent } from "../entite-simple/entite-simple-delete-confirmation.component";

@Component({
    selector: "meteo-removal-confirmation",
    templateUrl: "./meteo-delete-confirmation.tpl.html"
})
export class MeteoRemovalConfirmationComponent extends EntiteSimpleRemovalConfirmationComponent<Meteo> {

}
