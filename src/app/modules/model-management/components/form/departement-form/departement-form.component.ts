import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Departement } from "ouca-common/departement.object";
import { CrossFieldErrorMatcher } from "src/app/modules/shared/matchers/cross-field-error.matcher";
import { EntitySubFormComponent } from "../entite-simple-form/entity-sub-form.component";

@Component({
  selector: "departement-form",
  templateUrl: "./departement-form.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartementFormComponent extends EntitySubFormComponent<
  Departement
> {
  public departementCodeErrorStateMatcher = new CrossFieldErrorMatcher(
    "alreadyExistingCode"
  );
}
