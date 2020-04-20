import { Component } from "@angular/core";
import { Departement } from "ouca-common/departement.object";
import { Observable } from "rxjs";
import { DepartementFormComponent } from "../../components/form/departement-form/departement-form.component";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
  templateUrl: "./departement.tpl.html"
})
export class DepartementComponent extends EntiteSimpleComponent<Departement> {
  public getEntities$ = (): Observable<Departement[]> => {
    return this.entitiesStoreService.getDepartements$();
  };

  public updateEntities = (): void => {
    this.entitiesStoreService.updateDepartements();
  };

  public getEntityName(): string {
    return "departement";
  }

  public getAnEntityLabel(): string {
    return "un département";
  }

  public getTheEntityLabel(uppercase?: boolean): string {
    return uppercase ? "Le département" : "le département";
  }

  public getFormType(): any {
    return DepartementFormComponent;
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
