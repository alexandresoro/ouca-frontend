import { Component } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { Departement } from "basenaturaliste-model/departement.object";
import { EntitySubFormComponent } from "../entite-simple-form/entity-sub-form.component";

@Component({
  selector: "departement-form",
  templateUrl: "./departement-form.tpl.html"
})
export class DepartementFormComponent extends EntitySubFormComponent {
  public codeFormControl = new FormControl("", [Validators.required]);

  getNewObject(): Departement {
    return {} as Departement;
  }
}
