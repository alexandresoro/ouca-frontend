import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { EntiteSimple } from "ouca-common/entite-simple.object";
import { Observable } from "rxjs";
import { ConfirmationDialogData } from "src/app/modules/shared/components/confirmation-dialog/confirmation-dialog-data.object";
import { ConfirmationDialogComponent } from "src/app/modules/shared/components/confirmation-dialog/confirmation-dialog.component";
import { EntitiesStoreService } from "src/app/services/entities-store.service";
import { ExportService } from "src/app/services/export.service";

export abstract class EntiteSimpleComponent<T extends EntiteSimple> {
  constructor(
    private dialog: MatDialog,
    protected entitiesStoreService: EntitiesStoreService,
    private exportService: ExportService,
    private router: Router
  ) {}

  abstract getEntities$(): Observable<T[]>;

  abstract getEntityName(): string;

  abstract getDeleteMessage(entity: T): string;

  public exportObjects(): void {
    this.exportService.exportEntities(this.getEntityName());
  }

  public newObject(): void {
    this.router.navigate(["/" + this.getEntityName() + "/create"]);
  }

  public editObject(object: T): void {
    this.router.navigate(["/" + this.getEntityName() + "/edit/" + object?.id]);
  }

  public deleteObject(entity: T): void {
    this.openDeleteConfirmationDialog(entity);
  }

  private openDeleteConfirmationDialog = (entity: T): void => {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: "550px",
      data: new ConfirmationDialogData(
        "Confirmation de suppression",
        this.getDeleteMessage(entity),
        "Oui, supprimer",
        "Non, annuler"
      )
    });

    dialogRef.afterClosed().subscribe((shouldDeleteEntity) => {
      if (shouldDeleteEntity) {
        this.entitiesStoreService
          .deleteEntity(entity.id, this.getEntityName())
          .subscribe();
      }
    });
  };
}
