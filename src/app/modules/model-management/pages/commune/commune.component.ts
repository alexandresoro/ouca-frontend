import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { UICommune } from "src/app/models/commune.model";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";
@Component({
  templateUrl: "./commune.tpl.html"
})
export class CommuneComponent extends EntiteSimpleComponent<UICommune> {
  public getEntities$ = (): Observable<UICommune[]> => {
    return this.entitiesStoreService.getCommunes$();
  };

  public updateEntities = (): void => {
    this.entitiesStoreService.updateCommunes();
  };

  public getDeleteMessage(commune: UICommune): string {
    return (
      "Êtes-vous certain de vouloir supprimer la commune " +
      commune.nom +
      " ? " +
      "Tous les lieux-dits (" +
      commune.nbLieuxdits +
      ") et toutes les données (" +
      commune.nbDonnees +
      ") avec cette commune seront supprimés."
    );
  }

  getEntityName(): string {
    return "commune";
  }

  public getAnEntityLabel(): string {
    return "une commune";
  }

  public getTheEntityLabel(uppercase?: boolean): string {
    return uppercase ? "La commune" : "la commune";
  }
}
