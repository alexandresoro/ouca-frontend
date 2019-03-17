import { Component } from "@angular/core";
import { Comportement } from "basenaturaliste-model/comportement.object";
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

  getNewObject(): Comportement {
    return {} as Comportement;
  }
}
