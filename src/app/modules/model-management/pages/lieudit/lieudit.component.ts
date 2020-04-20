/* eslint-disable @typescript-eslint/unbound-method */
import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import * as _ from "lodash";
import { GPS } from "ouca-common/coordinates-system";
import { LieuditCommon } from "ouca-common/lieudit-common.model";
import { Lieudit } from "ouca-common/lieudit.model";
import { Observable } from "rxjs";
import { UILieudit } from "src/app/models/lieudit.model";
import { AppConfigurationService } from "src/app/services/app-configuration.service";
import { EntitiesStoreService } from "src/app/services/entities-store.service";
import { ExportService } from "src/app/services/export.service";
import { FormValidatorHelper } from "../../../shared/helpers/form-validator.helper";
import { LieuditFormComponent } from "../../components/form/lieudit-form/lieudit-form.component";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
  templateUrl: "./lieudit.component.html"
})
export class LieuditComponent extends EntiteSimpleComponent<LieuditCommon>
  implements OnInit {
  constructor(
    private appConfigurationService: AppConfigurationService,
    entitiesStoreService: EntitiesStoreService,
    exportService: ExportService,
    router: Router,
    dialog: MatDialog
  ) {
    super(dialog, entitiesStoreService, exportService, router);
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.form = new FormGroup(
      {
        id: new FormControl("", []),
        communeId: new FormControl("", [Validators.required]),
        nom: new FormControl("", [Validators.required]),
        altitude: new FormControl("", [
          Validators.required,
          this.altitudeNumberValidator()
        ]),
        longitude: new FormControl(),
        latitude: new FormControl()
      },
      [this.nomValidator]
    );
  }

  public getDeleteMessage(lieuDit: Lieudit): string {
    return (
      "Êtes-vous certain de vouloir supprimer le lieu-dit " +
      lieuDit.nom +
      " ? " +
      "Toutes les données (" +
      lieuDit.nbDonnees +
      ") avec ce lieu-dit seront supprimées."
    );
  }

  public getEntities$ = (): Observable<UILieudit[]> => {
    return this.entitiesStoreService.getLieuxdits$();
  };

  public updateEntities = (): void => {
    this.entitiesStoreService.updateLieuxDits();
  };

  public saveLieudit = (formValue: {
    id: number;
    communeId: number;
    nom: string;
    altitude: number;
    longitude: number;
    latitude: number;
  }): void => {
    const { longitude, latitude, ...lieuditAttributes } = formValue;
    // TODO
    // const system: CoordinatesSystemType = this.appConfigurationService.getAppCoordinatesSystemType();
    const system = GPS;
    const lieudit: Lieudit = {
      ...lieuditAttributes,
      coordinates: {
        longitude: longitude,
        latitude: latitude,
        system,
        isTransformed: false
      }
    };
  };

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
