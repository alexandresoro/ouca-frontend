import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CrossFieldErrorMatcher } from "src/app/modules/shared/matchers/cross-field-error.matcher";
import { EntiteAvecLibelleEtCode } from "../../../pages/entite-avec-libelle-et-code/entite-avec-libelle-et-code-edit.component";
import { EntitySubFormComponent } from "../entite-simple-form/entity-sub-form.component";
@Component({
  selector: "entite-avec-libelle-et-code-form",
  templateUrl: "./entite-avec-libelle-et-code-form.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntiteAvecLibelleEtCodeFormComponent extends EntitySubFormComponent<
EntiteAvecLibelleEtCode
> {
  public codeErrorStateMatcher = new CrossFieldErrorMatcher(
    "alreadyExistingCode"
  );

  public libelleErrorStateMatcher = new CrossFieldErrorMatcher(
    "alreadyExistingLibelle"
  );
}
