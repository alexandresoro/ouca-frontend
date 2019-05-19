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

  public getNewObject(): T {
    return {
      id: null,
      code: "",
      libelle: "",
      nbDonnees: 0
    } as T;
  }
}
