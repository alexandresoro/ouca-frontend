import { Component } from "@angular/core";
import { Meteo } from "ouca-common/meteo.object";
import { EntiteAvecLibelleTableComponent } from "../entite-avec-libelle-table/entite-avec-libelle-table.component";

@Component({
  selector: "meteo-table",
  styleUrls: [
    "../entite-avec-libelle-table/entite-avec-libelle-table.component.scss"
  ],
  templateUrl: "../entite-avec-libelle-table/entite-avec-libelle-table.tpl.html"
})
export class MeteoTableComponent extends EntiteAvecLibelleTableComponent<
  Meteo
> {}
