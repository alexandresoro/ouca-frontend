import { Component } from "@angular/core";
import { EstimationDistance } from "ouca-common/estimation-distance.object";
import { Observable } from "rxjs";
import { EntiteAvecLibelleComponent } from "../entite-avec-libelle/entite-avec-libelle.component";

@Component({
  templateUrl: "./estimation-distance.tpl.html"
})
export class EstimationDistanceComponent extends EntiteAvecLibelleComponent<
  EstimationDistance
> {
  public getEntities$ = (): Observable<EstimationDistance[]> => {
    return this.entitiesStoreService.getEstimationDistances$();
  };

  public updateEntities = (): void => {
    this.entitiesStoreService.updateEstimationsDistance();
  };

  getEntityName(): string {
    return "estimation-distance";
  }

  public getAnEntityLabel(): string {
    return "une estimation de la distance";
  }

  public getTheEntityLabel(uppercase?: boolean): string {
    return uppercase
      ? "L'estimation de la distance"
      : "l'estimation de la distance";
  }

  public getDeleteMessage(estimation: EstimationDistance): string {
    return (
      "Êtes-vous certain de vouloir supprimer l'estimation de la distance " +
      estimation.libelle +
      " ? " +
      estimation.nbDonnees +
      " données ont cette estimation de la distance."
    );
  }
}
