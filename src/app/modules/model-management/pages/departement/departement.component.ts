import { Component } from "@angular/core";
import { Departement } from "ouca-common/departement.object";
import { Observable } from "rxjs";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
  templateUrl: "./departement.component.html"
})
export class DepartementComponent extends EntiteSimpleComponent<Departement> {
  public getEntities$ = (): Observable<Departement[]> => {
    return this.entitiesStoreService.getDepartements$();
  };

  public getEntityName(): string {
    return "departement";
  }

  public getDeleteMessage(departement: Departement): string {
    return (
      "Êtes-vous certain de vouloir supprimer le département " +
      departement.code +
      " ? " +
      "Toutes les communes (" +
      departement.nbCommunes +
      "), tous les lieux-dits (" +
      departement.nbLieuxdits +
      ") et toutes les données (" +
      departement.nbDonnees +
      ") avec ce département seront supprimés."
    );
  }
}
