import { Component, OnInit } from "@angular/core";
import { EntiteResult } from "basenaturaliste-model/entite-result.object";
import { EntiteSimple } from "basenaturaliste-model/entite-simple.object";
import { PageStatusHelper } from "../../../shared/helpers/page-status.helper";
import { BackendApiService } from "../../../shared/services/backend-api.service";
import { EntiteComponent } from "../entite.component";
import { GestionMode } from "../gestion-mode.enum";
import { GestionModeHelper } from "../gestion-mode.enum";

@Component({
  template: ""
})
export class EntiteSimpleComponent<T extends EntiteSimple>
  extends EntiteComponent
  implements OnInit {
  public objects: T[];

  public currentObject: T;

  public objectToSave: T;

  public objectToView: T;

  public objectToRemove: T;

  public mode: GestionMode;

  constructor(
    private backendApiService: BackendApiService,
    modeHelper: GestionModeHelper
  ) {
    super(modeHelper);
  }

  public ngOnInit(): void {
    this.switchToViewAllMode();

    // Get all objects
    this.getAll();
  }

  public getAll(): void {
    PageStatusHelper.resetPageStatus();
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
          (result: EntiteResult<T>) => {
            PageStatusHelper.setSuccessStatus(
              "L'entité a été supprimée avec succès"
            );

            const index = this.objects.indexOf(this.objectToRemove);
            if (index > -1) {
              this.objects.splice(index, 1);
            }
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

  public saveObject(): void {
    this.backendApiService
      .saveEntity(this.getEntityName(), this.objectToSave, this.isEditionMode())
      .subscribe(
        (result: EntiteResult<T>) => {
          PageStatusHelper.setSuccessStatus(
            "L'entité a été sauvegardée avec succès"
          );

          if (this.isCreationMode()) {
            // Add the new entity in the list
            this.objects[this.objects.length] = result.object;
          }
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
    this.mode = GestionMode.CREATION;
  }

  private switchToEditionMode(object: T): void {
    PageStatusHelper.resetPageStatus();
    this.objectToSave = object;
    this.currentObject = object;
    this.mode = GestionMode.EDITION;
  }

  private switchToViewAllMode(): void {
    this.objectToSave = this.getNewObject();
    this.currentObject = undefined;
    this.mode = GestionMode.VIEW_ALL;
  }

  private switchToViewOneMode(object: T): void {
    PageStatusHelper.resetPageStatus();
    this.objectToView = object;
    this.currentObject = object;
    this.mode = GestionMode.VIEW_ONE;
  }

  private switchToRemoveMode(object: T): void {
    PageStatusHelper.resetPageStatus();
    this.objectToRemove = object;
    this.currentObject = object;
    this.mode = GestionMode.REMOVE;
  }
}
