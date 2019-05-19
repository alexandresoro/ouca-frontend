import { Component } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import { Departement } from "basenaturaliste-model/departement.object";
import { FormValidatorHelper } from "../../../shared/helpers/form-validator.helper";
import { ListHelper } from "../../../shared/helpers/list-helper";
import { EntityDetailsData } from "../../components/entity-details/entity-details-data.object";
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
        code: new FormControl("", [Validators.required]),
        nbCommunes: new FormControl("", []),
        nbLieuxdits: new FormControl("", []),
        nbDonnees: new FormControl("", [])
      },
      [this.departementValidator]
    );
  }

  private departementValidator: ValidatorFn = (
    formGroup: FormGroup
  ): ValidationErrors | null => {
    const code = formGroup.controls.code.value;
    const id = formGroup.controls.id.value;

    const foundDepartementByCode: Departement = ListHelper.findObjectInListByTextValue(
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

  public getEntityName(): string {
    return "departement";
  }

  public getAnEntityLabel(): string {
    return "un département";
  }

  getNewObject(): Departement {
    return {} as Departement;
  }

  public getFormType(): any {
    return DepartementFormComponent;
  }

  public getDetailsData(): EntityDetailsData[] {
    const detailsData: EntityDetailsData[] = [];
    detailsData[0] = new EntityDetailsData("ID", this.currentObject.id);
    detailsData[1] = new EntityDetailsData("Code", this.currentObject.code);
    detailsData[2] = new EntityDetailsData(
      "Nombre de communes",
      this.currentObject.nbCommunes
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
