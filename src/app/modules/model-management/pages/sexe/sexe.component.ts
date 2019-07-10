import { Component } from "@angular/core";
import { Sexe } from "basenaturaliste-model/sexe.object";
import { EntiteAvecLibelleComponent } from "../entite-avec-libelle/entite-avec-libelle.component";

@Component({
  templateUrl: "./sexe.tpl.html"
})
export class SexeComponent extends EntiteAvecLibelleComponent<Sexe> {
  getEntityName(): string {
    return "sexe";
  }

  public getAnEntityLabel(): string {
    return "un sexe";
  }

  public getTheEntityLabel(uppercase?: boolean): string {
    return !!uppercase ? "Le sexe" : "le sexe";
  }
}
