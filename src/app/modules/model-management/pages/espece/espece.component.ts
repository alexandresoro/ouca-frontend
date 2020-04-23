import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { UIEspece } from "src/app/models/espece.model";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
  templateUrl: "./espece.component.html"
})
export class EspeceComponent extends EntiteSimpleComponent<UIEspece> {
  public getEntities$ = (): Observable<UIEspece[]> => {
    return this.entitiesStoreService.getEspeces$();
  };

  getEntityName(): string {
    return "espece";
  }

  public getDeleteMessage(espece: UIEspece): string {
    return (
      "Êtes-vous certain de vouloir supprimer l'espèce " +
      espece.nomFrancais +
      " ? " +
      "Toutes les données (" +
      espece.nbDonnees +
      ") avec cette espèce seront supprimées."
    );
  }
}
