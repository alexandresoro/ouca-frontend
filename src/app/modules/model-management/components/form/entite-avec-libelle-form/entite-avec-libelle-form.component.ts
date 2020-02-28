import { Component } from "@angular/core";
import { EntiteAvecLibelle } from "ouca-common/entite-avec-libelle.object";
import { EntitySubFormComponent } from "../entite-simple-form/entity-sub-form.component";

@Component({
  selector: "entite-avec-libelle-form",
  templateUrl: "./entite-avec-libelle-form.tpl.html"
})
export class EntiteAvecLibelleFormComponent extends EntitySubFormComponent<
  EntiteAvecLibelle
> {}
