import { Component } from "@angular/core";
import { Age } from "basenaturaliste-model/age.object";
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

  public getNewObject(): Age {
    return {} as Age;
  }
}
