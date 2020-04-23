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
import _ from "lodash";
import { GPS } from "ouca-common/coordinates-system";
import { Observable } from "rxjs";
import { UILieudit } from "src/app/models/lieudit.model";
import { FormValidatorHelper } from "src/app/modules/shared/helpers/form-validator.helper";
import { EntitiesStoreService } from "src/app/services/entities-store.service";
import { LieuditFormComponent } from "../../components/form/lieudit-form/lieudit-form.component";
import { EntiteSimpleEditAbstractComponent } from "../entite-simple/entite-simple-edit.component";

@Component({
  templateUrl: "../entite-simple/entity-edit.component.html"
})
export class LieuDitEditComponent
  extends EntiteSimpleEditAbstractComponent<UILieudit>
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
      this.updateLieuDitValidators(this.getForm(), entities);
    });
  }

  public createForm(): FormGroup {
    return new FormGroup({
      id: new FormControl("", []),
      communeId: new FormControl("", [Validators.required]),
      nom: new FormControl("", [Validators.required]),
      altitude: new FormControl("", [
        Validators.required,
        this.altitudeNumberValidator()
      ]),
      longitude: new FormControl(),
      latitude: new FormControl()
    });
  }

  getEntityFromFormValue<Lieudit>(formValue: {
    id: number;
    communeId: number;
    nom: string;
    altitude: number;
    longitude: number;
    latitude: number;
  }): Lieudit {
    const { longitude, latitude, ...lieuditAttributes } = formValue;
    // TODO
    // const system: CoordinatesSystemType = this.appConfigurationService.getAppCoordinatesSystemType();
    const system = GPS;
    const lieuDit: Lieudit = {
      ...lieuditAttributes,
      coordinates: {
        longitude: longitude,
        latitude: latitude,
        system,
        isTransformed: false
      }
    } as any;
    return lieuDit;
  }

  public getFormType(): any {
    return LieuditFormComponent;
  }

  public getEntityName = (): string => {
    return "lieudit";
  };

  public getEntities$(): Observable<UILieudit[]> {
    return this.entitiesStoreService.getLieuxdits$();
  }

  private updateLieuDitValidators = (
    form: FormGroup,
    lieuxDits: UILieudit[]
  ): void => {
    form.setValidators([this.nomValidator(lieuxDits)]);
    form.updateValueAndValidity();
  };

  private nomValidator = (lieuxDits: UILieudit[]): ValidatorFn => {
    return (form: FormGroup): ValidationErrors | null => {
      const nom: string = form.controls.nom.value;
      const communeId: number = form.controls.communeId.value;
      const currentLieuDitId: number = form.controls.id.value;

      const matchingLieuDit: UILieudit =
        nom && communeId
          ? _.find(lieuxDits, (lieuDit) => {
              return (
                _.deburr(lieuDit.nom.trim().toLowerCase()) ===
                  _.deburr(nom.trim().toLowerCase()) &&
                lieuDit.commune.id === communeId
              );
            })
          : null;

      const valueIsAnExistingEntity: boolean =
        !!matchingLieuDit && currentLieuDitId !== matchingLieuDit.id;

      return valueIsAnExistingEntity
        ? {
            alreadyExistingNom: {
              message:
                "Il existe déjà un lieu-dit avec ce nom dans cette commune."
            }
          }
        : null;
    };
  };

  private altitudeNumberValidator(): ValidatorFn {
    return FormValidatorHelper.isAnIntegerValidator(0, 65535);
  }

  public getPageTitle = (): string => {
    return "Lieux-dits";
  };

  public getCreationTitle = (): string => {
    return "Création d'un lieu-dit";
  };

  public getEditionTitle = (): string => {
    return "Edition d'un lieu-dit";
  };
}
