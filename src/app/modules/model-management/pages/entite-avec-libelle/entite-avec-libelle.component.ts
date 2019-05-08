import { Component } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import { EntiteAvecLibelle } from "basenaturaliste-model/entite-avec-libelle.object";
import * as diacritics from "diacritics";
import * as _ from "lodash";
import { EntityDetailsData } from "../../components/entity-details/entity-details-data.object";
import { EntiteAvecLibelleFormComponent } from "../../components/form/entite-avec-libelle-form/entite-avec-libelle-form.component";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";
@Component({
  template: ""
})
export class EntiteAvecLibelleComponent<
  T extends EntiteAvecLibelle
> extends EntiteSimpleComponent<T> {
  public formComponentType = EntiteAvecLibelleFormComponent;

  public ngOnInit(): void {
    super.ngOnInit();
    this.form = new FormGroup(
      {
        id: new FormControl("", []),
        libelle: new FormControl("", [
          Validators.required,
          this.libelleValidator
        ]),
        nbDonnees: new FormControl("", [])
      },
      [this.entityWithLibelleValidator]
    );
  }

  private entityWithLibelleValidator: ValidatorFn = (
    formGroup: FormGroup
  ): ValidationErrors | null => {
    const libelle = formGroup.controls.libelle.value;
    const id = formGroup.controls.id.value;

    const valueIsAnExistingEntity: boolean = !!_.find(
      this.objects,
      (object: T) => {
        return (
          diacritics.remove(object.libelle.trim().toLowerCase()) ===
            diacritics.remove(libelle.trim().toLowerCase()) && id !== object.id
        );
      }
    );

    return valueIsAnExistingEntity
      ? {
          alreadyExisting: {
            message:
              "Il existe déjà " + this.getAnEntityLabel() + " avec ce libellé",
            value: libelle
          }
        }
      : null;
  }

  private libelleValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    return null;
  }

  public getDetailsData(): EntityDetailsData[] {
    const detailsData: EntityDetailsData[] = [];
    detailsData[0] = new EntityDetailsData("ID", this.currentObject.id);
    detailsData[1] = new EntityDetailsData(
      "Libellé",
      this.currentObject.libelle
    );
    detailsData[2] = new EntityDetailsData(
      "Nombre de fiches espèces",
      this.currentObject.nbDonnees
    );

    return detailsData;
  }
}
