import { ChangeDetectionStrategy, Component } from "@angular/core";
import { InputEstimationNombre } from "src/app/model/graphql";
import { CrossFieldErrorMatcher } from "src/app/modules/shared/matchers/cross-field-error.matcher";
import { EntitySubFormComponent } from "../entite-simple-form/entity-sub-form.component";

@Component({
  selector: "estimation-nombre-form",
  templateUrl: "./estimation-nombre-form.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EstimationNombreFormComponent extends EntitySubFormComponent<InputEstimationNombre & { id: number | null }> {
  public estimationLibelleErrorStateMatcher = new CrossFieldErrorMatcher(
    "alreadyExistingLibelle"
  );

  public libelleErrorStateMatcher = new CrossFieldErrorMatcher(
    "alreadyExistingLibelle"
  );

}
