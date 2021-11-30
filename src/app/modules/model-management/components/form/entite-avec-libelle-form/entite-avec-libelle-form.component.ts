import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CrossFieldErrorMatcher } from "src/app/modules/shared/matchers/cross-field-error.matcher";
import { EntiteAvecLibelle } from "../../../pages/entite-avec-libelle/entite-avec-libelle-edit.component";
import { EntitySubFormComponent } from "../entite-simple-form/entity-sub-form.component";

@Component({
  selector: "entite-avec-libelle-form",
  templateUrl: "./entite-avec-libelle-form.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntiteAvecLibelleFormComponent extends EntitySubFormComponent<
EntiteAvecLibelle
> {
  public libelleErrorStateMatcher = new CrossFieldErrorMatcher(
    "alreadyExistingLibelle"
  );
}
