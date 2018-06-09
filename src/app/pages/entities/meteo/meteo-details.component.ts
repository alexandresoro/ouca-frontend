import { Component } from "@angular/core";
import { Meteo } from "../../../model/meteo.object";
import { EntiteSimpleDetailsComponent } from "../entite-simple/entite-simple-details.component";

@Component({
    selector: "meteo-details",
    templateUrl: "./../entite-avec-libelle/entite-avec-libelle-details.tpl.html"
})
export class MeteoDetailsComponent extends EntiteSimpleDetailsComponent<Meteo> {
}
