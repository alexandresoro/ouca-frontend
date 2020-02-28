import { Component } from "@angular/core";
import { Departement } from "ouca-common/departement.object";
import { EntitySubFormComponent } from "../entite-simple-form/entity-sub-form.component";

@Component({
  selector: "departement-form",
  templateUrl: "./departement-form.tpl.html"
})
export class DepartementFormComponent extends EntitySubFormComponent<
  Departement
> {}
