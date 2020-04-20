import { Component } from "@angular/core";
import { Classe } from "ouca-common/classe.object";
import { Observable } from "rxjs";
import { EntiteAvecLibelleComponent } from "../entite-avec-libelle/entite-avec-libelle.component";

@Component({
  templateUrl: "./classe.tpl.html"
})
export class ClasseComponent extends EntiteAvecLibelleComponent<Classe> {
  public getEntities$ = (): Observable<Classe[]> => {
    return this.entitiesStoreService.getClasses$();
  };

  public updateEntities = (): void => {
    this.entitiesStoreService.updateClasses();
  };

  public getEntityName(): string {
    return "classe";
  }

  public getAnEntityLabel(): string {
    return "une classe";
  }

  public getTheEntityLabel(uppercase?: boolean): string {
    return uppercase ? "La classe" : "la classe";
  }

  public getDeleteMessage(classe: Classe): string {
    return (
      "Êtes-vous certain de vouloir supprimer la classe " +
      classe.libelle +
      " ? " +
      "Toutes les espèces (" +
      classe.nbEspeces +
      ") et toutes les données (" +
      classe.nbDonnees +
      ") avec cette classe seront supprimées."
    );
  }
}
