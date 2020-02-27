import { Component } from "@angular/core";
import { Age } from "ouca-common/age.object";
import { EntiteAvecLibelleComponent } from "../entite-avec-libelle/entite-avec-libelle.component";

@Component({
  templateUrl: "./age.tpl.html"
})
export class AgeComponent extends EntiteAvecLibelleComponent<Age> {
  public getEntityName(): string {
    return "age";
  }

  public getAnEntityLabel(): string {
    return "un âge";
  }

  public getTheEntityLabel(uppercase?: boolean): string {
    return uppercase ? "L'âge" : "l'âge";
  }
}
