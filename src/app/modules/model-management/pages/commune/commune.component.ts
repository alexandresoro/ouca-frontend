import { Component } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import { Commune } from "ouca-common/commune.object";
import * as _ from "lodash";
import { FormValidatorHelper } from "../../../shared/helpers/form-validator.helper";
import { EntityDetailsData } from "../../components/entity-details/entity-details-data.object";
import { CommuneFormComponent } from "../../components/form/commune-form/commune-form.component";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";
@Component({
  templateUrl: "./commune.tpl.html"
})
export class CommuneComponent extends EntiteSimpleComponent<Commune> {
  public ngOnInit(): void {
    super.ngOnInit();
    this.form = new FormGroup(
      {
        id: new FormControl("", []),
        departement: new FormControl("", []),
        departementId: new FormControl("", [Validators.required]),
        code: new FormControl("", [
          Validators.required,
          this.codeNumberValidator()
        ]),
        nom: new FormControl("", [Validators.required])
      },
      [this.codeValidator, this.nomValidator]
    );
  }

  public codeValidator: ValidatorFn = (
    formGroup: FormGroup
  ): ValidationErrors | null => {
    const code = formGroup.controls.code.value;
    const departement = formGroup.controls.departementId.value;
    const id = formGroup.controls.id.value;

    const foundEntityByCode: Commune = _.find(this.objects, (object: any) => {
      return object.code === code && object.departement.id === departement;
    });

    const valueIsAnExistingEntity: boolean =
      !!foundEntityByCode && id !== foundEntityByCode.id;

    return valueIsAnExistingEntity
      ? FormValidatorHelper.getValidatorResult(
          "alreadyExistingCode",
          "Il existe déjà " +
            this.getAnEntityLabel() +
            " avec ce code dans ce département."
        )
      : null;
  };

  private codeNumberValidator(): ValidatorFn {
    return FormValidatorHelper.isAnIntegerValidator(0, 65535);
  }

  public nomValidator: ValidatorFn = (
    formGroup: FormGroup
  ): ValidationErrors | null => {
    const nom = formGroup.controls.nom.value;
    const departement = formGroup.controls.departementId.value;
    const id = formGroup.controls.id.value;

    const foundEntityByCode: Commune = nom
      ? _.find(this.objects, (object: any) => {
          return (
            _.deburr(object.nom.trim().toLowerCase()) ===
              _.deburr(nom.trim().toLowerCase()) &&
            object.departement.id === departement
          );
        })
      : null;

    const valueIsAnExistingEntity: boolean =
      !!foundEntityByCode && id !== foundEntityByCode.id;

    return valueIsAnExistingEntity
      ? FormValidatorHelper.getValidatorResult(
          "alreadyExistingNom",
          "Il existe déjà " +
            this.getAnEntityLabel() +
            " avec ce nom dans ce département."
        )
      : null;
  };

  getEntityName(): string {
    return "commune";
  }

  public getAnEntityLabel(): string {
    return "une commune";
  }

  public getTheEntityLabel(uppercase?: boolean): string {
    return uppercase ? "La commune" : "la commune";
  }

  public getFormType(): any {
    return CommuneFormComponent;
  }

  public getDetailsData(): EntityDetailsData[] {
    const detailsData: EntityDetailsData[] = [];
    detailsData[0] = new EntityDetailsData("ID", this.currentObject.id);
    detailsData[1] = new EntityDetailsData(
      "Département",
      this.currentObject.departement.code
    );
    detailsData[2] = new EntityDetailsData(
      "Code de la Commune",
      this.currentObject.code
    );
    detailsData[3] = new EntityDetailsData(
      "Nom de la Commune",
      this.currentObject.nom
    );
    detailsData[3] = new EntityDetailsData(
      "Nombre de lieux-dits",
      this.currentObject.nbLieuxdits
    );
    detailsData[4] = new EntityDetailsData(
      "Nombre de fiches espèces",
      this.currentObject.nbDonnees
    );

    return detailsData;
  }
}
