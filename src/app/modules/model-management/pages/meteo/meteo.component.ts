import { Component } from "@angular/core";
import { Meteo } from "ouca-common/meteo.object";
import { Observable } from "rxjs";
import { EntiteAvecLibelleComponent } from "../entite-avec-libelle/entite-avec-libelle.component";

@Component({
  templateUrl: "./meteo.tpl.html"
})
export class MeteoComponent extends EntiteAvecLibelleComponent<Meteo> {
  public getEntities$ = (): Observable<Meteo[]> => {
    return this.entitiesStoreService.getMeteos$();
  };

  public updateEntities = (): void => {
    this.entitiesStoreService.updateMeteos();
  };

  getEntityName(): string {
    return "meteo";
  }

  public getAnEntityLabel(): string {
    return "une météo";
  }

  public getTheEntityLabel(uppercase?: boolean): string {
    return uppercase ? "La météo" : "la météo";
  }
}
