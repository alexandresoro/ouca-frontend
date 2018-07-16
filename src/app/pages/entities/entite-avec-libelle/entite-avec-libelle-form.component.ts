import { Component } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { EntiteAvecLibelle } from "../../../model/entite-avec-libelle.object";
import { EntiteSimpleFormComponent } from "../entite-simple/entite-simple-form.component";
import { GestionModeHelper } from "../gestion-mode.enum";

@Component({
  selector: "entite-avec-libelle-form",
  templateUrl: "./entite-avec-libelle-form.tpl.html"
})
export class EntiteAvecLibelleFormComponent<T extends EntiteAvecLibelle>
  extends EntiteSimpleFormComponent<T> {
  public libelleFormControl = new FormControl("", [Validators.required]);

  constructor(
    modeHelper: GestionModeHelper
  ) {
    super(modeHelper);
  }

}
