import { Component } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { EntiteAvecLibelleEtCode } from "../../../../model/entite-avec-libelle-et-code.object";
import { EntiteSimpleFormComponent } from "../entite-simple/entite-simple-form.component";
import { GestionModeHelper } from "../gestion-mode.enum";

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
