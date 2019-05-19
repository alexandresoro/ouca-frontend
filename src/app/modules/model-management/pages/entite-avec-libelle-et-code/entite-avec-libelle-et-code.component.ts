import { Component } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import { EntiteAvecLibelleEtCode } from "basenaturaliste-model/entite-avec-libelle-et-code.object";
import { FormValidatorHelper } from "../../../shared/helpers/form-validator.helper";
import { ListHelper } from "../../../shared/helpers/list-helper";
import { EntityDetailsData } from "../../components/entity-details/entity-details-data.object";
import { EntiteAvecLibelleEtCodeFormComponent } from "../../components/form/entite-avec-libelle-et-code-form/entite-avec-libelle-et-code-form.component";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
  template: ""
})
export class EntiteAvecLibelleEtCodeComponent<
  T extends EntiteAvecLibelleEtCode
> extends EntiteSimpleComponent<T> {
  public ngOnInit(): void {
    super.ngOnInit();
    this.form = new FormGroup(
      {
        id: new FormControl("", []),
        code: new FormControl("", [Validators.required]),
        libelle: new FormControl("", [Validators.required]),
        nbDonnees: new FormControl("", [])
      },
      [this.libelleValidator, this.codeValidator]
    );
  }

  private libelleValidator: ValidatorFn = (
    formGroup: FormGroup
  ): ValidationErrors | null => {
    const libelle = formGroup.controls.libelle.value;
    const id = formGroup.controls.id.value;

    const foundDepartementByLibelle: EntiteAvecLibelleEtCode = ListHelper.findObjectInListByTextValue(
      this.objects,
      "libelle",
      libelle
    );

    const valueIsAnExistingEntity: boolean =
      !!foundDepartementByLibelle && id !== foundDepartementByLibelle.id;

    return valueIsAnExistingEntity
      ? FormValidatorHelper.getValidatorResult(
          "alreadyExistingLibelle",
          "Il existe déjà " + this.getAnEntityLabel() + " avec ce libellé."
        )
      : null;
  }

  private codeValidator: ValidatorFn = (
    formGroup: FormGroup
  ): ValidationErrors | null => {
    const code = formGroup.controls.code.value;
    const id = formGroup.controls.id.value;

    const foundDepartementByCode: EntiteAvecLibelleEtCode = ListHelper.findObjectInListByTextValue(
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
  }

  public getFormType(): any {
    return EntiteAvecLibelleEtCodeFormComponent;
  }

  public getDetailsData(): EntityDetailsData[] {
    const detailsData: EntityDetailsData[] = [];
    detailsData[0] = new EntityDetailsData("ID", this.currentObject.id);
    detailsData[1] = new EntityDetailsData("Code", this.currentObject.code);
    detailsData[2] = new EntityDetailsData(
      "Libellé",
      this.currentObject.libelle
    );
    detailsData[3] = new EntityDetailsData(
      "Nombre de fiches espèces",
      this.currentObject.nbDonnees
    );

    return detailsData;
  }
}
