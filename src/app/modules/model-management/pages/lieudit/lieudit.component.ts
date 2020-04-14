import { Component } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import * as _ from "lodash";
import { Lieudit } from "ouca-common/lieudit.object";
import { BackendApiService } from "src/app/services/backend-api.service";
import { CoordinatesBuilderService } from "src/app/services/coordinates-builder.service";
import { CreationPageModelService } from "src/app/services/creation-page-model.service";
import { StatusMessageService } from "src/app/services/status-message.service";
import { FormValidatorHelper } from "../../../shared/helpers/form-validator.helper";
import { LieuditFormComponent } from "../../components/form/lieudit-form/lieudit-form.component";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
  templateUrl: "./lieudit.tpl.html",
})
export class LieuditComponent extends EntiteSimpleComponent<Lieudit> {
  constructor(
    backendApiService: BackendApiService,
    creationPageModelService: CreationPageModelService,
    private coordinatesBuilderService: CoordinatesBuilderService,
    statusMessageService: StatusMessageService
  ) {
    super(backendApiService, creationPageModelService, statusMessageService);
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.form = new FormGroup(
      {
        id: new FormControl("", []),
        commune: new FormControl("", []),
        communeId: new FormControl("", [Validators.required]),
        nom: new FormControl("", [Validators.required]),
        altitude: new FormControl("", [
          Validators.required,
          this.altitudeNumberValidator(),
        ]),
        longitude: new FormControl(),
        latitude: new FormControl(),
      },
      [this.nomValidator]
    );
  }

  public saveObject(formValue: any): void {
    const { longitude, latitude, ...otherParams } = formValue;
    const lieudit: Lieudit = {
      ...otherParams,
      coordinates: this.coordinatesBuilderService.buildCoordinates(
        longitude,
        latitude
      ),
    };
    super.saveObject(lieudit);
  }

  public nomValidator: ValidatorFn = (
    formGroup: FormGroup
  ): ValidationErrors | null => {
    const nom = formGroup.controls.nom.value;
    const communeId = formGroup.controls.communeId.value;
    const id = formGroup.controls.id.value;

    const foundEntityByCode: Lieudit =
      nom && communeId
        ? _.find(this.objects, (object: any) => {
            return (
              _.deburr(object.nom.trim().toLowerCase()) ===
                _.deburr(nom.trim().toLowerCase()) &&
              object.commune.id === communeId
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
            " avec ce nom dans cette commune."
        )
      : null;
  };

  private altitudeNumberValidator(): ValidatorFn {
    return FormValidatorHelper.isAnIntegerValidator(0, 65535);
  }

  getEntityName(): string {
    return "lieudit";
  }

  public getAnEntityLabel(): string {
    return "un lieu-dit";
  }

  public getTheEntityLabel(uppercase?: boolean): string {
    return uppercase ? "Le lieu-dit" : "le lieu-dit";
  }

  public getFormType(): any {
    return LieuditFormComponent;
  }
}
