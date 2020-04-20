import { Component } from "@angular/core";
import { Age } from "ouca-common/age.object";
import { Observable } from "rxjs";
import { EntiteAvecLibelleComponent } from "../entite-avec-libelle/entite-avec-libelle.component";

@Component({
  templateUrl: "./age.tpl.html"
})
export class AgeComponent extends EntiteAvecLibelleComponent<Age> {
  public getEntities$ = (): Observable<Age[]> => {
    return this.entitiesStoreService.getAges$();
  };

  public updateEntities = (): void => {
    this.entitiesStoreService.updateAges();
  };

  public getEntityName(): string {
    return "age";
  }

  public getAnEntityLabel(): string {
    return "un âge";
  }

  public getTheEntityLabel(uppercase?: boolean): string {
    return uppercase ? "L'âge" : "l'âge";
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
