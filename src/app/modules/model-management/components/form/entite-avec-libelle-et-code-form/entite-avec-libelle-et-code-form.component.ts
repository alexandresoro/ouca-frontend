import { Component } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { EntiteAvecLibelleEtCode } from "basenaturaliste-model/entite-avec-libelle-et-code.object";
import { GestionModeHelper } from "../../../pages/gestion-mode.enum";
import { EntiteSimpleFormComponent } from "../entite-simple-form/entite-simple-form.component";

@Component({
  selector: "entite-avec-libelle-et-code-form",
  templateUrl: "./entite-avec-libelle-et-code-form.tpl.html"
})
export class EntiteAvecLibelleEtCodeFormComponent<
  T extends EntiteAvecLibelleEtCode
> extends EntiteSimpleFormComponent<T> {
  public codeFormControl = new FormControl("", [Validators.required]);
  public libelleFormControl = new FormControl("", [Validators.required]);

  constructor(modeHelper: GestionModeHelper) {
    super(modeHelper);
  }
}
