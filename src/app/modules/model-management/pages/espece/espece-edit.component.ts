import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { UIEspece } from "src/app/models/espece.model";
import { ListHelper } from "src/app/modules/shared/helpers/list-helper";
import { EntitiesStoreService } from "src/app/services/entities-store.service";
import { EspeceFormComponent } from "../../components/form/espece-form/espece-form.component";
import { EntiteSimpleEditAbstractComponent } from "../entite-simple/entite-simple-edit.component";

@Component({
  templateUrl: "../entite-simple/entity-edit.component.html"
})
export class EspeceEditComponent
  extends EntiteSimpleEditAbstractComponent<UIEspece>
  implements OnInit {
  constructor(
    entitiesStoreService: EntitiesStoreService,
    route: ActivatedRoute,
    router: Router,
    location: Location
  ) {
    super(entitiesStoreService, router, route, location);
  }

  ngOnInit(): void {
    this.initialize();
  }

  protected initialize(): void {
    super.initialize();

    this.getEntities$().subscribe((entities) => {
      this.updateEspeceValidators(this.getForm(), entities);
    });
  }

  public createForm(): FormGroup {
    return new FormGroup({
      id: new FormControl("", []),
      classe: new FormControl("", [Validators.required]),
      code: new FormControl("", [Validators.required]),
      nomFrancais: new FormControl("", [Validators.required]),
      nomLatin: new FormControl("", [Validators.required])
    });
  }

  protected getEntityFromFormValue<Espece>(formValue: any): Espece {
    const { classe, ...especeAttributes } = formValue;
    return {
      ...especeAttributes,
      classeId: classe.id
    };
  }

  public getFormType(): any {
    return EspeceFormComponent;
  }

  public getEntityName = (): string => {
    return "espece";
  };

  public getEntities$(): Observable<UIEspece[]> {
    return this.entitiesStoreService.getEspeces$();
  }

  private updateEspeceValidators = (
    form: FormGroup,
    especes: UIEspece[]
  ): void => {
    form.setValidators([
      this.codeValidator(especes),
      this.nomFrancaisValidator(especes),
      this.nomLatinValidator(especes)
    ]);
    form.updateValueAndValidity();
  };

  private codeValidator = (especes: UIEspece[]): ValidatorFn => {
    return (form: FormGroup): ValidationErrors | null => {
      const code: string = form.controls.code.value;
      const currentEspeceId: number = form.controls.id.value;

      const matchingEspece: UIEspece = ListHelper.findEntityInListByStringAttribute(
        especes,
        "code",
        code
      );

      const isAnExistingEntity: boolean =
        !!matchingEspece && currentEspeceId !== matchingEspece.id;

      return isAnExistingEntity
        ? {
            alreadyExistingCode: {
              message: "Il existe déjà une espèce avec ce code."
            }
          }
        : null;
    };
  };

  private nomFrancaisValidator = (especes: UIEspece[]): ValidatorFn => {
    return (form: FormGroup): ValidationErrors | null => {
      const nomFrancais = form.controls.nomFrancais.value;
      const id = form.controls.id.value;

      const matchingEspece: UIEspece = ListHelper.findEntityInListByStringAttribute(
        especes,
        "nomFrancais",
        nomFrancais
      );

      const isAnExistingEntity: boolean =
        !!matchingEspece && id !== matchingEspece.id;

      return isAnExistingEntity
        ? {
            alreadyExistingNomFrancais: {
              message: "Il existe déjà une espèce avec ce nom français."
            }
          }
        : null;
    };
  };

  private nomLatinValidator = (especes: UIEspece[]): ValidatorFn => {
    return (form: FormGroup): ValidationErrors | null => {
      const nomLatin: string = form.controls.nomLatin.value;
      const currentEspeceId: number = form.controls.id.value;

      const matchingEspece: UIEspece = ListHelper.findEntityInListByStringAttribute(
        especes,
        "nomLatin",
        nomLatin
      );

      const isAnExistingEntity: boolean =
        !!matchingEspece && currentEspeceId !== matchingEspece.id;

      return isAnExistingEntity
        ? {
            alreadyExistingNomLatin: {
              message: "Il existe déjà une espèce avec ce nom latin."
            }
          }
        : null;
    };
  };

  public getPageTitle = (): string => {
    return "Espèces";
  };

  public getCreationTitle = (): string => {
    return "Création d'une espèce";
  };

  public getEditionTitle = (): string => {
    return "Edition d'une espèce";
  };
}
