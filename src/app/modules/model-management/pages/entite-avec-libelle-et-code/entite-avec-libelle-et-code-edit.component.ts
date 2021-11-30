import {
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import { findEntityInListByStringAttribute } from "src/app/modules/shared/helpers/list-helper";
import { EntiteAvecLibelleEtCodeFormComponent } from "../../components/form/entite-avec-libelle-et-code-form/entite-avec-libelle-et-code-form.component";
import { ENTITIES_PROPERTIES } from "../../models/entities-properties.model";
import { EntiteAvecLibelle, EntiteAvecLibelleEditAbstractComponent } from "../entite-avec-libelle/entite-avec-libelle-edit.component";

export type EntiteAvecLibelleEtCode = EntiteAvecLibelle & {
  code: string;
}

export abstract class EntiteAvecLibelleEtCodeEditAbstractComponent<
  T extends EntiteAvecLibelleEtCode
  > extends EntiteAvecLibelleEditAbstractComponent<T> {
  protected initialize(): void {
    super.initialize();

    this.getEntities$().subscribe((entities) => {
      this.updateEntityWithLibelleAndCodeValidators(this.getForm(), entities);
    });
  }

  public createForm(): FormGroup {
    return new FormGroup({
      id: new FormControl("", []),
      code: new FormControl("", [Validators.required]),
      libelle: new FormControl("", [Validators.required])
    });
  }

  public getFormType(): typeof EntiteAvecLibelleEtCodeFormComponent {
    return EntiteAvecLibelleEtCodeFormComponent;
  }

  private updateEntityWithLibelleAndCodeValidators = (
    form: FormGroup,
    entities: T[]
  ): void => {
    form.setValidators([
      this.codeValidator(
        entities,
        ENTITIES_PROPERTIES[this.getEntityName()].anEntityLabel
      ),
      this.libelleValidator(
        entities,
        ENTITIES_PROPERTIES[this.getEntityName()].anEntityLabel
      )
    ]);
    form.updateValueAndValidity();
  };

  private codeValidator = (
    entities: T[],
    anEntityLabel: string
  ): ValidatorFn => {
    return (form: FormGroup): ValidationErrors | null => {
      const code: string = form.controls.code.value;
      const currentEntityId: number = form.controls.id.value;

      const matchingEntity = findEntityInListByStringAttribute(
        entities,
        "code",
        code
      );

      const isAnExistingEntity: boolean =
        matchingEntity && matchingEntity.id !== currentEntityId;

      return isAnExistingEntity
        ? {
          alreadyExistingCode: {
            message: "Il existe déjà " + anEntityLabel + " avec ce code."
          }
        }
        : null;
    };
  };
}
