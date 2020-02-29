import { HttpErrorResponse } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormControl, FormGroupDirective, NgForm } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { Commune } from "ouca-common/commune.object";
import { Departement } from "ouca-common/departement.object";
import { BackendApiService } from "../../../../shared/services/backend-api.service";
import { EntitySubFormComponent } from "../entite-simple-form/entity-sub-form.component";

const isInvalidControl = (control: FormControl): boolean => {
  return !!(control?.dirty && control?.invalid);
};

const isFormGroupInvalidBecauseOfProvidedError = (
  form: FormGroupDirective | NgForm,
  error: string
): boolean => {
  return !!(form?.dirty && form?.invalid && form?.getError(error));
};

class CommuneErrorStateMatcher implements ErrorStateMatcher {
  constructor(private errorType: string) {}

  isErrorState(
    control: FormControl,
    form: FormGroupDirective | NgForm
  ): boolean {
    return (
      isInvalidControl(control) ||
      isFormGroupInvalidBecauseOfProvidedError(form, this.errorType)
    );
  }
}

@Component({
  selector: "commune-form",
  templateUrl: "./commune-form.tpl.html"
})
export class CommuneFormComponent extends EntitySubFormComponent<Commune> {
  public departements: Departement[];

  public communeCodeErrorStateMatcher = new CommuneErrorStateMatcher(
    "alreadyExistingCode"
  );

  public communeNomErrorStateMatcher = new CommuneErrorStateMatcher(
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
