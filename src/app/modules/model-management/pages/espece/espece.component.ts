import { Component } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import { Espece } from "ouca-common/espece.object";
import { FormValidatorHelper } from "../../../shared/helpers/form-validator.helper";
import { ListHelper } from "../../../shared/helpers/list-helper";
import { EspeceFormComponent } from "../../components/form/espece-form/espece-form.component";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
  templateUrl: "./espece.tpl.html"
})
export class EspeceComponent extends EntiteSimpleComponent<Espece> {
  public ngOnInit(): void {
    super.ngOnInit();
    this.form = new FormGroup(
      {
        id: new FormControl("", []),
        classe: new FormControl("", [Validators.required]),
        code: new FormControl("", [Validators.required]),
        nomFrancais: new FormControl("", [Validators.required]),
        nomLatin: new FormControl("", [Validators.required])
      },
      [this.codeValidator, this.nomFrancaisValidator, this.nomLatinValidator]
    );
  }

  private nomFrancaisValidator: ValidatorFn = (
    formGroup: FormGroup
  ): ValidationErrors | null => {
    const nomFrancais = formGroup.controls.nomFrancais.value;
    const id = formGroup.controls.id.value;

    const foundEspeceByCode: Espece = ListHelper.findEntityInListByStringAttribute(
      this.objects,
      "nomFrancais",
      nomFrancais
    );

    const valueIsAnExistingEntity: boolean =
      !!foundEspeceByCode && id !== foundEspeceByCode.id;

    return valueIsAnExistingEntity
      ? FormValidatorHelper.getValidatorResult(
          "alreadyExistingNomFrancais",
          "Il existe déjà " + this.getAnEntityLabel() + " avec ce nom français."
        )
      : null;
  };

  private nomLatinValidator: ValidatorFn = (
    formGroup: FormGroup
  ): ValidationErrors | null => {
    const nomLatin = formGroup.controls.nomLatin.value;
    const id = formGroup.controls.id.value;

    const foundEspeceByCode: Espece = ListHelper.findEntityInListByStringAttribute(
      this.objects,
      "nomLatin",
      nomLatin
    );

    const valueIsAnExistingEntity: boolean =
      !!foundEspeceByCode && id !== foundEspeceByCode.id;

    return valueIsAnExistingEntity
      ? FormValidatorHelper.getValidatorResult(
          "alreadyExistingNomLatin",
          "Il existe déjà " + this.getAnEntityLabel() + " avec ce nom latin."
        )
      : null;
  };

  getEntityName(): string {
    return "espece";
  }

  public getAnEntityLabel(): string {
    return "une espèce";
  }

  public getTheEntityLabel(uppercase?: boolean): string {
    return uppercase ? "L'espèce" : "l'espèce";
  }

  public getFormType(): any {
    return EspeceFormComponent;
  }
}
