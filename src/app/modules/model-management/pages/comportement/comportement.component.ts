import { Component } from "@angular/core";
import { Comportement } from "ouca-common/comportement.object";
import { EntiteAvecLibelleEtCodeComponent } from "../entite-avec-libelle-et-code/entite-avec-libelle-et-code.component";
@Component({
  templateUrl: "./comportement.tpl.html"
})
export class ComportementComponent extends EntiteAvecLibelleEtCodeComponent<
  Comportement
> {
  getEntityName(): string {
    return "comportement";
  }

  public getAnEntityLabel(): string {
    return "un comportement";
  }

  public getTheEntityLabel(uppercase?: boolean): string {
    return uppercase ? "Le comportement" : "le comportement";
  }
}
