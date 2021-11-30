import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { ConfirmationDialogData } from "src/app/modules/shared/components/confirmation-dialog/confirmation-dialog-data.object";
import { ConfirmationDialogComponent } from "src/app/modules/shared/components/confirmation-dialog/confirmation-dialog.component";

export type EntiteSimple = {
  id: number;
}

export abstract class EntiteSimpleComponent<T extends EntiteSimple> {
  constructor(
    private dialog: MatDialog,
    private router: Router,
  ) { }

  abstract getEntityName(): string;

  abstract getDeleteMessage(entity: T): string;

  abstract getDeleteMutation(entity: T): Observable<number | null>;

  abstract handleEntityDeletionResult(id: number | null): void;

  public newObject(): void {
    this.router.navigate(["/" + this.getEntityName() + "/create"]);
  }

  public editObject(id: number): void {
    this.router.navigate(["/" + this.getEntityName() + "/edit/" + id]);
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
        this.getDeleteMutation(entity).subscribe((resultId) => {
          this.handleEntityDeletionResult(resultId);
        });
      }
    });
  };
}
