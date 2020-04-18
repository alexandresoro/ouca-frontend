import { OnInit } from "@angular/core";
import { FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";
import { EntiteSimple } from "ouca-common/entite-simple.object";
import { Observable } from "rxjs";
import { EntitiesStoreService } from "src/app/services/entities-store.service";
import { ExportService } from "src/app/services/export.service";
import { FormValidatorHelper } from "../../../shared/helpers/form-validator.helper";
import { ListHelper } from "../../../shared/helpers/list-helper";
import { EntityModeHelper } from "../../helpers/entity-mode.helper";

export abstract class EntiteSimpleComponent<T extends EntiteSimple>
  implements OnInit {
  // TODO remove objects
  public objects: T[];

  public entities$: Observable<T[]>;

  public currentObject: T;

  public objectToSave: T;

  public objectToView: T;

  public objectToRemove: T;

  public form: FormGroup;

  public entityModeHelper = EntityModeHelper;

  constructor(
    protected entitiesStoreService: EntitiesStoreService,
    private exportService: ExportService
  ) {}

  public ngOnInit(): void {
    this.entities$ = this.getEntities$();
    this.switchToViewAllMode();
  }

  abstract getEntities$(): Observable<T[]>;

  abstract updateEntities(): void;

  abstract getEntityName(): string;

  abstract getAnEntityLabel(): string;

  abstract getTheEntityLabel(uppercase?: boolean): string;

  public getNewObject(): T {
    return {} as T;
  }

  abstract getFormType(): any;

  public newObject(): void {
    this.switchToCreationMode();
  }

  public deleteObject(object: T): void {
    this.switchToRemoveMode(object);
  }

  public confirmObjectRemoval(isConfirmed: boolean): void {
    if (isConfirmed && this.objectToRemove?.id) {
      this.entitiesStoreService
        .deleteEntity(
          this.objectToRemove.id,
          this.getEntityName(),
          this.getTheEntityLabel(true)
        )
        .subscribe((isSuccessful) => {
          if (isSuccessful) {
            this.updateEntities();
            this.switchToViewAllMode();
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

  public saveObject = <E extends EntiteSimple>(entity: E): void => {
    this.entitiesStoreService
      .saveEntity(entity, this.getEntityName(), this.getTheEntityLabel(true))
      .subscribe((isSuccessful) => {
        if (isSuccessful) {
          this.updateEntities();
          this.switchToViewAllMode();
        }
      });
  };

  public exportObjects(): void {
    this.exportService.exportEntities(this.getEntityName());
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
