import { Component } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import { Departement } from "ouca-common/departement.object";
import { FormValidatorHelper } from "../../../shared/helpers/form-validator.helper";
import { ListHelper } from "../../../shared/helpers/list-helper";
import { DepartementFormComponent } from "../../components/form/departement-form/departement-form.component";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
  templateUrl: "./departement.tpl.html"
})
export class DepartementComponent extends EntiteSimpleComponent<Departement> {
  public ngOnInit(): void {
    super.ngOnInit();
    this.form = new FormGroup(
      {
        id: new FormControl("", []),
        code: new FormControl("", [Validators.required])
      },
      [this.departementValidator]
    );
  }

  private departementValidator: ValidatorFn = (
    formGroup: FormGroup
  ): ValidationErrors | null => {
    const code = formGroup.controls.code.value;
    const id = formGroup.controls.id.value;

    const foundDepartementByCode: Departement = ListHelper.findEntityInListByStringAttribute(
      this.objects,
      "code",
      code
    );

    const valueIsAnExistingEntity: boolean =
      !!foundDepartementByCode && id !== foundDepartementByCode.id;

    return valueIsAnExistingEntity
      ? FormValidatorHelper.getValidatorResult(
          "alreadyExistingCode",
          "Il existe déjà " + this.getAnEntityLabel() + " avec ce code."
        )
      : null;
  };

  public getEntityName(): string {
    return "departement";
  }

  public getAnEntityLabel(): string {
    return "un département";
  }

  public getTheEntityLabel(uppercase?: boolean): string {
    return uppercase ? "Le département" : "le département";
  }

  public getFormType(): any {
    return DepartementFormComponent;
  }
}
