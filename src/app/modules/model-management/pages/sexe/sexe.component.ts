import { Component } from "@angular/core";
import { Sexe } from "ouca-common/sexe.object";
import { Observable } from "rxjs";
import { EntiteAvecLibelleComponent } from "../entite-avec-libelle/entite-avec-libelle.component";

@Component({
  templateUrl: "./sexe.component.html"
})
export class SexeComponent extends EntiteAvecLibelleComponent<Sexe> {
  public getEntities$ = (): Observable<Sexe[]> => {
    return this.entitiesStoreService.getSexes$();
  };

  getEntityName(): string {
    return "sexe";
  }

  public getDeleteMessage(sexe: Sexe): string {
    return (
      "Êtes-vous certain de vouloir supprimer le sexe " +
      sexe.libelle +
      " ? " +
      "Toutes les données (" +
      sexe.nbDonnees +
      ") avec ce sexe seront supprimées."
    );
  }
}
