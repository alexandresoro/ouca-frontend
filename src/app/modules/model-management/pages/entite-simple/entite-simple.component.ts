import { Component, OnInit } from "@angular/core";
import { Response } from "@angular/http";
import { EntiteResult } from "../../../../model/entite-result.object";
import { EntiteSimple } from "../../../../model/entite-simple.object";
import { EntiteComponent } from "../../../../pages/entite.component";
import { GestionMode } from "../gestion-mode.enum";
import { GestionModeHelper } from "../gestion-mode.enum";
import { EntiteSimpleService } from "./entite-simple.service";

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
    private entiteSimpleService: EntiteSimpleService<T>,
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
    this.clearMessages();
    this.entiteSimpleService.getAllObjects(this.getEntityName()).subscribe(
      (result: T[]) => {
        this.objects = result;
      },
      (error: Response) => {
        this.setErrorMessage("Impossible de trouver les objets.");
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
      this.entiteSimpleService
        .httpGet(this.getEntityName() + "/delete/" + this.objectToRemove.id)
        .subscribe(
          (result: EntiteResult<T>) => {
            this.updatePageStatus(result.status, result.messages);
            if (this.isSuccess()) {
              const index = this.objects.indexOf(this.objectToRemove);
              if (index > -1) {
                this.objects.splice(index, 1);
              }
              this.switchToViewAllMode();
            }
          },
          (error: Response) => {
            // tslint:disable-next-line:max-line-length
            console.error(
              "ERREUR lors de la suppression de l'objet de type " +
                this.getEntityName(),
              this.objectToRemove,
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
    let action: string = this.getEntityName() + "/create";
    if (this.isEditionMode()) {
      action = this.getEntityName() + "/update";
    }

    console.log("Start saving " + this.getEntityName(), this.objectToSave);

    this.entiteSimpleService.httpPost(action, this.objectToSave).subscribe(
      (result: EntiteResult<T>) => {
        this.updatePageStatus(result.status, result.messages);
        if (this.isSuccess()) {
          if (this.isCreationMode()) {
            // Add the new entity in the list
            this.objects[this.objects.length] = result.object;
          }
          this.switchToViewAllMode();
        }
      },
      (error: Response) => {
        console.error(
          "ERREUR: lors de la sauvegarde de l'objet de type " +
            this.getEntityName(),
          this.objectToSave,
          error
        );
      }
    );
  }

  public cancelEdition(): void {
    this.clearMessages();
    this.switchToViewAllMode();
  }

  private switchToCreationMode(): void {
    this.clearMessages();
    this.objectToSave = this.getNewObject();
    this.currentObject = this.getNewObject();
    this.mode = GestionMode.CREATION;
  }

  private switchToEditionMode(object: T): void {
    this.clearMessages();
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
    this.clearMessages();
    this.objectToView = object;
    this.currentObject = object;
    this.mode = GestionMode.VIEW_ONE;
  }

  private switchToRemoveMode(object: T): void {
    this.clearMessages();
    this.objectToRemove = object;
    this.currentObject = object;
    this.mode = GestionMode.REMOVE;
  }
}
