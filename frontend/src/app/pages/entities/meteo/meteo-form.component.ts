import { Component } from "@angular/core";
import { Meteo } from "../../../model/meteo.object";
import { EntiteSimpleFormComponent } from "../entite-simple/entite-simple-form.component";

@Component({
    selector: "meteo-form",
    templateUrl: "./../entite-avec-libelle/entite-avec-libelle-form.tpl.html"
})
export class MeteoFormComponent extends EntiteSimpleFormComponent<Meteo> {

    getNewObject(): Meteo {
        return new Meteo();
    }
}
