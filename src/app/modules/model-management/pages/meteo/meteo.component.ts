import { Component } from "@angular/core";
import { Meteo } from "basenaturaliste-model/meteo.object";
import { EntiteAvecLibelleComponent } from "../entite-avec-libelle/entite-avec-libelle.component";

@Component({
  templateUrl: "./meteo.tpl.html"
})
export class MeteoComponent extends EntiteAvecLibelleComponent<Meteo> {
  getEntityName(): string {
    return "meteo";
  }

  public getAnEntityLabel(): string {
    return "une météo";
  }
  getNewObject(): Meteo {
    return {} as Meteo;
  }
}
