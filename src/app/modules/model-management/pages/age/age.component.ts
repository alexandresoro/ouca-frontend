import { Component } from "@angular/core";
import { Age } from "../../../../model/age.object";
import { EntiteAvecLibelleComponent } from "../entite-avec-libelle/entite-avec-libelle.component";

@Component({
  templateUrl: "./age.tpl.html"
})
export class AgeComponent extends EntiteAvecLibelleComponent<Age> {
  public getEntityName(): string {
    return "age";
  }

  public getNewObject(): Age {
    return new Age();
  }
}
