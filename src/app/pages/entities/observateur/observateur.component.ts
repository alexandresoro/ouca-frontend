import { Component } from "@angular/core";
import { Observateur } from "../../../model/observateur.object";
import { EntiteAvecLibelleComponent } from "../entite-avec-libelle/entite-avec-libelle.component";

@Component({
  templateUrl: "./observateur.tpl.html"
})
export class ObservateurComponent extends EntiteAvecLibelleComponent<
  Observateur
> {
  getEntityName(): string {
    return "observateur";
  }

  getNewObject(): Observateur {
    return new Observateur();
  }
}
