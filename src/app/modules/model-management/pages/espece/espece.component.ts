import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { UIEspece } from "src/app/models/espece.model";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
  templateUrl: "./espece.tpl.html"
})
export class EspeceComponent extends EntiteSimpleComponent<UIEspece> {
  public getEntities$ = (): Observable<UIEspece[]> => {
    return this.entitiesStoreService.getEspeces$();
  };

  public updateEntities = (): void => {
    this.entitiesStoreService.updateEspeces();
  };

  getEntityName(): string {
    return "espece";
  }

  public getAnEntityLabel(): string {
    return "une espèce";
  }

  public getTheEntityLabel(uppercase?: boolean): string {
    return uppercase ? "L'espèce" : "l'espèce";
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
