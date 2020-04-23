import { Component } from "@angular/core";
import { Age } from "ouca-common/age.object";
import { Observable } from "rxjs";
import { EntiteAvecLibelleComponent } from "../entite-avec-libelle/entite-avec-libelle.component";

@Component({
  templateUrl: "./age.component.html"
})
export class AgeComponent extends EntiteAvecLibelleComponent<Age> {
  public getEntities$ = (): Observable<Age[]> => {
    return this.entitiesStoreService.getAges$();
  };

  public getEntityName(): string {
    return "age";
  }

  public getDeleteMessage(age: Age): string {
    return (
      "Êtes-vous certain de vouloir supprimer l'âge " +
      age.libelle +
      " ? " +
      "Toutes les données (" +
      age.nbDonnees +
      ") avec cet âge seront supprimées."
    );
  }
}
