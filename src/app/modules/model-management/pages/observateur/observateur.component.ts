import { Component } from "@angular/core";
import { Observateur } from "ouca-common/observateur.object";
import { EntiteAvecLibelleComponent } from "../entite-avec-libelle/entite-avec-libelle.component";
@Component({
  templateUrl: "./observateur.tpl.html"
})
export class ObservateurComponent extends EntiteAvecLibelleComponent<
  Observateur
> {
  public getEntityName(): string {
    return "observateur";
  }

  public getAnEntityLabel(): string {
    return "un observateur";
  }

  public getTheEntityLabel(uppercase?: boolean): string {
    return uppercase ? "L'observateur" : "l'observateur";
  }
}
