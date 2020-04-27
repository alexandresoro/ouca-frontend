import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Commune } from "ouca-common/commune.model";
import { Departement } from "ouca-common/departement.object";
import { CrossFieldErrorMatcher } from "src/app/modules/shared/matchers/cross-field-error.matcher";
import { BackendApiService } from "src/app/services/backend-api.service";
import { EntitySubFormComponent } from "../entite-simple-form/entity-sub-form.component";

@Component({
  selector: "commune-form",
  templateUrl: "./commune-form.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommuneFormComponent extends EntitySubFormComponent<Commune> {
  public departements: Departement[];

  public communeCodeErrorStateMatcher = new CrossFieldErrorMatcher(
    "alreadyExistingCode"
  );

  public communeNomErrorStateMatcher = new CrossFieldErrorMatcher(
    "alreadyExistingNom"
  );

  constructor(private backendApiService: BackendApiService) {
    super();
  }

  ngOnInit(): void {
    // Get all departements
    this.backendApiService.getAllEntities("departement").subscribe(
      (result: Departement[]) => {
        this.departements = result;

        if (this.entityForm.controls.departement.value) {
          this.entityForm.controls.departementId.setValue(
            this.entityForm.controls.departement.value.id
          );
        }
      },
      (error: HttpErrorResponse) => {
        console.error("Impossible de trouver les départements (" + error + ")");
      }
    );
  }
}
