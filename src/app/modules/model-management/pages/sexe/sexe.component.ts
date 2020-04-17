import { Component } from "@angular/core";
import { Sexe } from "ouca-common/sexe.object";
import { Observable } from "rxjs";
import { EntiteAvecLibelleComponent } from "../entite-avec-libelle/entite-avec-libelle.component";

@Component({
  templateUrl: "./sexe.tpl.html"
})
export class SexeComponent extends EntiteAvecLibelleComponent<Sexe> {
  public getEntities$ = (): Observable<Sexe[]> => {
    return this.entitiesStoreService.getSexes$();
  };

  public updateEntities = (): void => {
    this.entitiesStoreService.updateSexes();
  };

  getEntityName(): string {
    return "sexe";
  }

  public getAnEntityLabel(): string {
    return "un sexe";
  }

  public getTheEntityLabel(uppercase?: boolean): string {
    return uppercase ? "Le sexe" : "le sexe";
  }
}
