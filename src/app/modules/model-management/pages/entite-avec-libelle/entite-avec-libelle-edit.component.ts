import {
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import { findEntityInListByStringAttribute } from "src/app/modules/shared/helpers/list-helper";
import { EntiteAvecLibelleFormComponent } from "../../components/form/entite-avec-libelle-form/entite-avec-libelle-form.component";
import { ENTITIES_PROPERTIES } from "../../models/entities-properties.model";
import { EntiteSimpleEditAbstractComponent } from "../entite-simple/entite-simple-edit.component";
import { EntiteSimple } from "../entite-simple/entite-simple.component";

export type EntiteAvecLibelle = EntiteSimple & {
  libelle: string;
}

export abstract class EntiteAvecLibelleEditAbstractComponent<
  T extends EntiteAvecLibelle
  > extends EntiteSimpleEditAbstractComponent<T> {
  protected initialize(): void {
    super.initialize();

    this.getEntities$().subscribe((entities) => {
      this.updateEntityValidators(this.getForm(), entities);
    });
  }

  public createForm(): FormGroup {
    return new FormGroup({
      id: new FormControl("", []),
      libelle: new FormControl("", [Validators.required])
    });
  }

  public getFormType(): typeof EntiteAvecLibelleFormComponent {
    return EntiteAvecLibelleFormComponent;
  }

  private updateEntityValidators = (form: FormGroup, entities: T[]): void => {
    form.setValidators([
      this.libelleValidator(
        entities,
        ENTITIES_PROPERTIES[this.getEntityName()].anEntityLabel
      )
    ]);
    form.updateValueAndValidity();
  };

  protected libelleValidator = <T extends EntiteAvecLibelle>(
    entities: T[],
    anEntityLabel: string
  ): ValidatorFn => {
    return (form: FormGroup): ValidationErrors | null => {
      const libelle: string = form.controls.libelle.value;
      const currentEntityId: number = form.controls.id.value;

      const matchingEntity = findEntityInListByStringAttribute(
        entities,
        "libelle",
        libelle
      );

      const isAnExistingEntity: boolean =
        matchingEntity && matchingEntity.id !== currentEntityId;

      return isAnExistingEntity
        ? {
          alreadyExistingLibelle: {
            message: "Il existe déjà " + anEntityLabel + " avec ce libellé."
          }
        }
        : null;
    };
  };
}
