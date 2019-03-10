import { Component } from "@angular/core";
import { Meteo } from "../../../../model/meteo.object";
import { EntiteAvecLibelleTableComponent } from "../entite-avec-libelle/entite-avec-libelle-table.component";

@Component({
  selector: "meteo-table",
  templateUrl: "./../entite-avec-libelle/entite-avec-libelle-table.tpl.html"
})
export class MeteoTableComponent extends EntiteAvecLibelleTableComponent<
  Meteo
> {}
