import { Component } from "@angular/core";
import { Meteo } from "basenaturaliste-model/meteo.object";
import { EntiteAvecLibelleTableComponent } from "../entite-avec-libelle-table/entite-avec-libelle-table.component";

@Component({
  selector: "meteo-table",
  templateUrl: "../entite-avec-libelle-table/entite-avec-libelle-table.tpl.html"
})
export class MeteoTableComponent extends EntiteAvecLibelleTableComponent<
  Meteo
> {}
