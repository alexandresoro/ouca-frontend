import { Component } from "@angular/core";
import { Comportement } from "ouca-common/comportement.object";
import { Observable } from "rxjs";
import { EntiteAvecLibelleEtCodeComponent } from "../entite-avec-libelle-et-code/entite-avec-libelle-et-code.component";
@Component({
  templateUrl: "./comportement.component.html"
})
export class ComportementComponent extends EntiteAvecLibelleEtCodeComponent<
  Comportement
> {
  public getEntities$ = (): Observable<Comportement[]> => {
    return this.entitiesStoreService.getComportements$();
  };

  public updateEntities = (): void => {
    this.entitiesStoreService.updateComportements();
  };

  getEntityName(): string {
    return "comportement";
  }

  public getDeleteMessage(comportement: Comportement): string {
    return (
      "Êtes-vous certain de vouloir supprimer le comportement " +
      comportement.libelle +
      " ? " +
      comportement.nbDonnees +
      " données ont ce comportement."
    );
  }
}
