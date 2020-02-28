import { Component } from "@angular/core";
import { EntiteAvecLibelleEtCode } from "ouca-common/entite-avec-libelle-et-code.object";
import { EntitySubFormComponent } from "../entite-simple-form/entity-sub-form.component";
@Component({
  selector: "entite-avec-libelle-et-code-form",
  templateUrl: "./entite-avec-libelle-et-code-form.tpl.html"
})
export class EntiteAvecLibelleEtCodeFormComponent extends EntitySubFormComponent<
  EntiteAvecLibelleEtCode
> {}
