import { Component } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { EntiteAvecLibelle } from "basenaturaliste-model/entite-avec-libelle.object";
import { GestionModeHelper } from "../../../pages/gestion-mode.enum";
import { EntiteSimpleFormComponent } from "../entite-simple-form/entite-simple-form.component";

@Component({
  selector: "entite-avec-libelle-form",
  templateUrl: "./entite-avec-libelle-form.tpl.html"
})
export class EntiteAvecLibelleFormComponent<
  T extends EntiteAvecLibelle
> extends EntiteSimpleFormComponent<T> {
  public libelleFormControl = new FormControl("", [Validators.required]);

  constructor(modeHelper: GestionModeHelper) {
    super(modeHelper);
  }
}
