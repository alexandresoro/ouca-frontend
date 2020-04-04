import { Component, OnInit } from "@angular/core";
import { FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";
import { EntiteSimple } from "ouca-common/entite-simple.object";
import { PostResponse } from "ouca-common/post-response.object";
import { BackendApiService } from "src/app/services/backend-api.service";
import { StatusMessageService } from "../../../../services/status-message.service";
import {
  getContentTypeFromResponse,
  saveFile
} from "../../../shared/helpers/file-downloader.helper";
import { FormValidatorHelper } from "../../../shared/helpers/form-validator.helper";
import { ListHelper } from "../../../shared/helpers/list-helper";
import { EntitySubFormComponent } from "../../components/form/entite-simple-form/entity-sub-form.component";
import { EntityModeHelper } from "../../helpers/entity-mode.helper";

@Component({
  template: ""
})
export class EntiteSimpleComponent<T extends EntiteSimple> implements OnInit {
  public objects: T[];

  public currentObject: T;

  public objectToSave: T;

  public objectToView: T;

  public objectToRemove: T;

  public form: FormGroup;

  public entityModeHelper = EntityModeHelper;

  constructor(
    private backendApiService: BackendApiService,
    private statusMessageService: StatusMessageService
  ) {}

  public ngOnInit(): void {
    this.switchToViewAllMode();
  }

  public getAll(): void {
    this.backendApiService
      .getAllEntities(this.getEntityName())
      .subscribe((result: T[]) => {
        this.objects = result;
      });
  }

  public getEntityName(): string {
    return "unknown";
  }

  public getAnEntityLabel(): string {
    return "une entité";
  }

  public getTheEntityLabel(uppercase?: boolean): string {
    return uppercase ? "L'entité" : "l'entité";
  }

  public getNewObject(): T {
    return {} as T;
  }

  public getFormType(): any {
    return EntitySubFormComponent;
  }

  public newObject(): void {
    this.switchToCreationMode();
  }

  public deleteObject(object: T): void {
    this.switchToRemoveMode(object);
  }

  public confirmObjectRemoval(isConfirmed: boolean): void {
    if (!!isConfirmed && !!this.objectToRemove) {
      this.backendApiService
        .deleteEntity(this.getEntityName(), this.objectToRemove.id)
        .subscribe((response: PostResponse) => {
          if (response.isSuccess) {
            this.statusMessageService.showSuccessMessage(
              this.getTheEntityLabel(true) + " a été supprimé(e) avec succès."
            );
            this.switchToViewAllMode();
          } else {
            this.statusMessageService.showErrorMessage(
              "Une erreue est survenue pendant la suppression.",
              response.message
            );
          }
        });
    } else {
      this.switchToViewAllMode();
    }
  }

  public editObject(object: T): void {
    this.switchToEditionMode(object);
  }

  public viewObject(object: T): void {
    this.switchToViewOneMode(object);
  }

  public viewAll(): void {
    this.switchToViewAllMode();
  }

  public saveObject(objectToSave: T): void {
    this.backendApiService
      .saveEntity(this.getEntityName(), objectToSave)
      .subscribe((response: PostResponse) => {
        if (response.isSuccess) {
          this.statusMessageService.showSuccessMessage(
            this.getTheEntityLabel(true) + " a été sauvegardé(e) avec succès."
          );
          this.switchToViewAllMode();
        } else {
          this.statusMessageService.showErrorMessage(
            "Une erreur est survenue pendant la sauvegarde.",
            response.message
          );
        }
      });
  }

  public exportObjects(): void {
    this.backendApiService
      .exportData(this.getEntityName())
      .subscribe((response: any) => {
        saveFile(
          response.body,
          this.getEntityName() + ".xlsx",
          getContentTypeFromResponse(response)
        );
      });
  }

  public cancelEdition(): void {
    this.switchToViewAllMode();
  }

  public resetForm(): void {
    if (this.form) {
      this.form.reset({});
    }
  }

  private switchToCreationMode(): void {
    this.objectToSave = this.getNewObject();
    this.currentObject = this.getNewObject();
    EntityModeHelper.switchToCreationMode();
  }

  private switchToEditionMode(object: T): void {
    this.objectToSave = object;
    this.currentObject = object;
    EntityModeHelper.switchToEditionMode();
  }

  private switchToViewAllMode(): void {
    this.getAll();
    this.resetForm();
    this.objectToSave = this.getNewObject();
    this.currentObject = undefined;
    EntityModeHelper.switchToViewAllMode();
  }

  private switchToViewOneMode(object: T): void {
    this.objectToView = object;
    this.currentObject = object;
    EntityModeHelper.switchToViewOneMode();
  }

  private switchToRemoveMode(object: T): void {
    this.objectToRemove = object;
    this.currentObject = object;
    EntityModeHelper.switchToRemoveMode();
  }

  public libelleValidator: ValidatorFn = (
    formGroup: FormGroup
  ): ValidationErrors | null => {
    const libelle = formGroup.controls.libelle.value;
    const id = formGroup.controls.id.value;

    const foundEntityByLibelle: T = ListHelper.findEntityInListByStringAttribute(
      this.objects,
      "libelle",
      libelle
    );

    const valueIsAnExistingEntity: boolean =
      !!foundEntityByLibelle && id !== foundEntityByLibelle.id;

    return valueIsAnExistingEntity
      ? FormValidatorHelper.getValidatorResult(
          "alreadyExistingLibelle",
          "Il existe déjà " + this.getAnEntityLabel() + " avec ce libellé."
        )
      : null;
  };

  public codeValidator: ValidatorFn = (
    formGroup: FormGroup
  ): ValidationErrors | null => {
    const code = formGroup.controls.code.value;
    const id = formGroup.controls.id.value;

    const foundEntityByCode: T = ListHelper.findEntityInListByStringAttribute(
      this.objects,
      "code",
      code
    );

    const valueIsAnExistingEntity: boolean =
      !!foundEntityByCode && id !== foundEntityByCode.id;

    return valueIsAnExistingEntity
      ? FormValidatorHelper.getValidatorResult(
          "alreadyExistingCode",
          "Il existe déjà " + this.getAnEntityLabel() + " avec ce code."
        )
      : null;
  };
}
