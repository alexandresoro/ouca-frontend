import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { DbUpdateResult } from "basenaturaliste-model/db-update-result.object";
import { EntiteSimple } from "basenaturaliste-model/entite-simple.object";
import { PageStatusHelper } from "../../../shared/helpers/page-status.helper";
import { BackendApiService } from "../../../shared/services/backend-api.service";
import { EntitySubFormComponent } from "../../components/form/entite-simple-form/entity-sub-form.component";
import { EntityModeHelper } from "../../helpers/entity-mode.helper";

@Component({
  template: ""
})
export class EntiteSimpleComponent<T extends EntiteSimple> implements OnInit {
  public formComponentType = EntitySubFormComponent;

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

    // Get all objects
    this.getAll();
  }

  public getAll(withoutResetPageStatus?: boolean): void {
    if (!withoutResetPageStatus) {
      PageStatusHelper.resetPageStatus();
    }
    this.backendApiService.getAllEntities(this.getEntityName()).subscribe(
      (result: T[]) => {
        this.objects = result;
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

  public getNewObject(): T {
    return null;
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
              "L'entité a été supprimée avec succès"
            );

            this.getAll(true);
            this.switchToViewAllMode();
          },
          (error: Response) => {
            PageStatusHelper.setErrorStatus(
              "Echec de la suppression de l'entité de type " +
                this.getEntityName(),
              error
            );
          }
        );
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
      .saveEntity(
        this.getEntityName(),
        objectToSave,
        EntityModeHelper.isEditionMode()
      )
      .subscribe(
        (result: DbUpdateResult) => {
          PageStatusHelper.setSuccessStatus(
            "L'entité a été sauvegardée avec succès"
          );

          this.getAll(true);
          this.switchToViewAllMode();
        },
        (error: Response) => {
          PageStatusHelper.setErrorStatus(
            "Impossible de sauvegarder l'entité de type " +
              this.getEntityName(),
            error
          );
        }
      );
  }

  public cancelEdition(): void {
    PageStatusHelper.resetPageStatus();
    this.switchToViewAllMode();
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

  private switchToViewAllMode(): void {
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
}
