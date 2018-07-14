import { Component } from "@angular/core";
import { Sexe } from "../../../model/sexe.object";
import { EntiteAvecLibelleComponent } from "../entite-avec-libelle/entite-avec-libelle.component";

@Component({
  templateUrl: "./sexe.tpl.html"
})
export class SexeComponent extends EntiteAvecLibelleComponent<Sexe> {
  getEntityName(): string {
    return "sexe";
  }

  getNewObject(): Sexe {
    return new Sexe();
  }
}
