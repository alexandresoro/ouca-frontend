import { Component } from "@angular/core";
import { CrossFieldErrorMatcher } from "src/app/modules/shared/matchers/cross-field-error.matcher";
import { EntiteAvecLibelleFormComponent } from "../entite-avec-libelle-form/entite-avec-libelle-form.component";

@Component({
  selector: "estimation-nombre-form",
  templateUrl: "./estimation-nombre-form.tpl.html"
})
export class EstimationNombreFormComponent extends EntiteAvecLibelleFormComponent {
  public estimationLibelleErrorStateMatcher = new CrossFieldErrorMatcher(
    "alreadyExistingLibelle"
  );
}
