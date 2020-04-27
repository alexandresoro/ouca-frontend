import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Commune } from "ouca-common/commune.model";
import { Departement } from "ouca-common/departement.object";
import { Observable } from "rxjs";
import { CrossFieldErrorMatcher } from "src/app/modules/shared/matchers/cross-field-error.matcher";
import { EntitiesStoreService } from "src/app/services/entities-store.service";
import { EntitySubFormComponent } from "../entite-simple-form/entity-sub-form.component";

@Component({
  selector: "commune-form",
  templateUrl: "./commune-form.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommuneFormComponent extends EntitySubFormComponent<Commune> {
  public departements$: Observable<Departement[]>;

  public communeCodeErrorStateMatcher = new CrossFieldErrorMatcher(
    "alreadyExistingCode"
  );

  public communeNomErrorStateMatcher = new CrossFieldErrorMatcher(
    "alreadyExistingNom"
  );

  constructor(private entitiesStoreService: EntitiesStoreService) {
    super();
    this.departements$ = this.entitiesStoreService.getDepartements$();
  }
}
