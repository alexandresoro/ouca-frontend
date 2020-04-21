import { Component } from "@angular/core";
import { EstimationNombre } from "ouca-common/estimation-nombre.object";
import { Observable } from "rxjs";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
  templateUrl: "./estimation-nombre.component.html"
})
export class EstimationNombreComponent extends EntiteSimpleComponent<
  EstimationNombre
> {
  public getEntities$ = (): Observable<EstimationNombre[]> => {
    return this.entitiesStoreService.getEstimationNombres$();
  };

  public updateEntities = (): void => {
    this.entitiesStoreService.updateEstimationsNombre();
  };

  getEntityName(): string {
    return "estimation-nombre";
  }

  public getDeleteMessage(estimation: EstimationNombre): string {
    return (
      "Êtes-vous certain de vouloir supprimer l'estimation du nombre " +
      estimation.libelle +
      " ? " +
      "Toutes les données (" +
      estimation.nbDonnees +
      ") avec cette estimation du nombre seront supprimées."
    );
  }
}
