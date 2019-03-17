import { Component } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { Departement } from "basenaturaliste-model/departement.object";
import { EntiteSimpleFormComponent } from "../entite-simple-form/entite-simple-form.component";

@Component({
  selector: "departement-form",
  templateUrl: "./departement-form.tpl.html"
})
export class DepartementFormComponent extends EntiteSimpleFormComponent<
  Departement
> {
  public codeFormControl = new FormControl("", [Validators.required]);

  getNewObject(): Departement {
    return {} as Departement;
  }
}
