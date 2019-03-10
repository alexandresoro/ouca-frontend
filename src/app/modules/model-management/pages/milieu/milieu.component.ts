import { Component } from "@angular/core";
import { Milieu } from "../../../../model/milieu.object";
import { EntiteAvecLibelleEtCodeComponent } from "../entite-avec-libelle-et-code/entite-avec-libelle-et-code.component";

@Component({
  templateUrl: "./milieu.tpl.html"
})
export class MilieuComponent extends EntiteAvecLibelleEtCodeComponent<Milieu> {
  getEntityName(): string {
    return "milieu";
  }

  getNewObject(): Milieu {
    return new Milieu();
  }
}
