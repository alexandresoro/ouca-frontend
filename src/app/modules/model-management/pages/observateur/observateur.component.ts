import { Component } from "@angular/core";
import { Observateur } from "ouca-common/observateur.object";
import { Observable } from "rxjs";
import { EntiteAvecLibelleComponent } from "../entite-avec-libelle/entite-avec-libelle.component";
@Component({
  templateUrl: "./observateur.component.html"
})
export class ObservateurComponent extends EntiteAvecLibelleComponent<
  Observateur
> {
  public getEntities$ = (): Observable<Observateur[]> => {
    return this.entitiesStoreService.getObservateurs$();
  };

  public updateEntities = (): void => {
    this.entitiesStoreService.updateObservateurs();
  };

  public getEntityName = (): string => {
    return "observateur";
  };

  public getDeleteMessage(observateur: Observateur): string {
    return (
      "Êtes-vous certain de vouloir supprimer l'observateur " +
      observateur.libelle +
      " ? " +
      "Toutes les données (" +
      observateur.nbDonnees +
      ") avec cet observateur seront supprimées."
    );
  }
}
