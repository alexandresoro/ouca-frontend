import { Component } from "@angular/core";
import { Meteo } from "../../../model/meteo.object";
import { EntiteSimpleTableComponent } from "../entite-simple/entite-simple-table.component";

@Component({
    selector: "meteo-table",
    templateUrl: "./../entite-avec-libelle/entite-avec-libelle-table.tpl.html"
})
export class MeteoTableComponent extends EntiteSimpleTableComponent<Meteo> {
}
