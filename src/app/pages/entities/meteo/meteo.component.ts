import { Component } from "@angular/core";
import { Meteo } from "../../../model/meteo.object";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
    templateUrl: "./meteo.tpl.html"
})
export class MeteoComponent extends EntiteSimpleComponent<Meteo> {

    getEntityName(): string {
        return "meteo";
    }

    getNewObject(): Meteo {
        return new Meteo();
    }
}
