import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  ValidationErrors,
  ValidatorFn
} from "@angular/forms";
import { DbUpdateResult } from "basenaturaliste-model/db-update-result.object";
import { EntiteSimple } from "basenaturaliste-model/entite-simple.object";
import { FormValidatorHelper } from "../../../shared/helpers/form-validator.helper";
import { ListHelper } from "../../../shared/helpers/list-helper";
import { PageStatusHelper } from "../../../shared/helpers/page-status.helper";
import { BackendApiService } from "../../../shared/services/backend-api.service";
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

  constructor(private backendApiService: BackendApiService) {}

  public ngOnInit(): void {
    this.switchToViewAllMode();
  }

  public getAll(doNotResetPageStatus?: boolean): void {
    if (!doNotResetPageStatus) {
      PageStatusHelper.resetPageStatus();
    }

    this.backendApiService.getAllEntities(this.getEntityName()).subscribe(
      (result: T[]) => {
        this.objects = result;
        console.log(this.objects);
      },
      (error: Response) => {
        PageStatusHelper.setErrorStatus(
          "Impossible de trouver les objets.",
          error
        );
      }
    );
  }

  public getEntityName(): string {
    return "";
  }

  public getAnEntityLabel(): string {
    return "une entité";
  }

  public getTheEntityLabel(uppercase?: boolean): string {
    return !!uppercase ? "L'entité" : "l'entité";
  }

  public getNewObject(): T {
    return null;
  }

  public getFormType(): any {
    return EntitySubFormComponent;
  }

  public newObject(): void {
    this.switchToCreationMode();
  }

  public exportObjects(): void {
    alert("Fonctionnalité non supportée");
  }

  public deleteObject(object: T): void {
    this.switchToRemoveMode(object);
  }

  public confirmObjectRemoval(isConfirmed: boolean): void {
    if (!!isConfirmed && !!this.objectToRemove) {
      this.backendApiService
        .deleteEntity(this.getEntityName(), this.objectToRemove.id)
        .subscribe(
          (result: DbUpdateResult) => {
            PageStatusHelper.setSuccessStatus(
              this.getTheEntityLabel(true) + " a été supprimé(e) avec succès"
            );

            this.switchToViewAllMode(true);
          },
          (error: Response) => {
            PageStatusHelper.setErrorStatus(
              "Echec de la suppression de " + this.getTheEntityLabel(),
              error
            );
          }
        );
    } else {
      this.switchToViewAllMode();
    }
  }

  public editObject(object: T): void {
    console.log("Object to display", object);
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
      .saveEntity(
        this.getEntityName(),
        objectToSave,
        EntityModeHelper.isEditionMode()
      )
      .subscribe(
        (result: DbUpdateResult) => {
          if (!!result && (!!result.insertId || !!result.affectedRows)) {
            PageStatusHelper.setSuccessStatus(
              this.getTheEntityLabel(true) + " a été sauvegardé(e) avec succès"
            );

            this.switchToViewAllMode(true);
          } else {
            PageStatusHelper.setErrorStatus(
              "Erreur lors de la sauvegarde de " + this.getTheEntityLabel(),
              result
            );
          }
        },
        (error: Response) => {
          PageStatusHelper.setErrorStatus(
            "Erreur lors de la sauvegarde de " + this.getTheEntityLabel(),
            error
          );
        }
      );
  }

  public cancelEdition(): void {
    PageStatusHelper.resetPageStatus();
    this.switchToViewAllMode();
  }

  public resetForm() {
    if (!!this.form) {
      this.form.reset(this.getNewObject());
    }
  }

  private switchToCreationMode(): void {
    PageStatusHelper.resetPageStatus();
    this.objectToSave = this.getNewObject();
    this.currentObject = this.getNewObject();
    EntityModeHelper.switchToCreationMode();
  }

  private switchToEditionMode(object: T): void {
    PageStatusHelper.resetPageStatus();
    this.objectToSave = object;
    this.currentObject = object;
    EntityModeHelper.switchToEditionMode();
  }

  private switchToViewAllMode(doNotResetPageStatus?: boolean): void {
    this.getAll(doNotResetPageStatus);
    this.resetForm();
    this.objectToSave = this.getNewObject();
    this.currentObject = undefined;
    EntityModeHelper.switchToViewAllMode();
  }

  private switchToViewOneMode(object: T): void {
    PageStatusHelper.resetPageStatus();
    this.objectToView = object;
    this.currentObject = object;
    EntityModeHelper.switchToViewOneMode();
  }

  private switchToRemoveMode(object: T): void {
    PageStatusHelper.resetPageStatus();
    this.objectToRemove = object;
    this.currentObject = object;
    EntityModeHelper.switchToRemoveMode();
  }

  public libelleValidator: ValidatorFn = (
    formGroup: FormGroup
  ): ValidationErrors | null => {
    const libelle = formGroup.controls.libelle.value;
    const id = formGroup.controls.id.value;

    const foundEntityByLibelle: T = ListHelper.findObjectInListByTextValue(
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
  }

  public codeValidator: ValidatorFn = (
    formGroup: FormGroup
  ): ValidationErrors | null => {
    const code = formGroup.controls.code.value;
    const id = formGroup.controls.id.value;

    const foundEntityByCode: T = ListHelper.findObjectInListByTextValue(
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
  }
}
