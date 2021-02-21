import { Component, EventEmitter, Output, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { EntiteSimple } from "@ou-ca/ouca-model";
import * as _ from "lodash";
import { BehaviorSubject, Observable } from "rxjs";

@Component({
  template: ""
})
export abstract class EntiteSimpleTableComponent<T extends EntiteSimple> {
  private currentEntities$: BehaviorSubject<T[]> = new BehaviorSubject([]);

  @Output() public delete: EventEmitter<T> = new EventEmitter<T>();

  @Output() public edit: EventEmitter<number> = new EventEmitter<number>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public dataSource: MatTableDataSource<unknown> = new MatTableDataSource();

  public selectedObjectId: number;

  protected initialize(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (
      data: unknown,
      sortHeaderId: string
    ): string => {
      if (typeof data[sortHeaderId] === "string") {
        return _.deburr(data[sortHeaderId].toLocaleLowerCase());
      }

      return data[sortHeaderId];
    };

    this.getEntities$().subscribe((entities) => {
      this.currentEntities$.next(entities);
      this.dataSource.data = this.getDataSource(entities);
    });
  }

  protected getDataSource(entities: T[]): unknown[] {
    return entities;
  }

  protected abstract getEntities$(): Observable<T[]>;

  public deleteObject = (): void => {
    const entities = this.currentEntities$.value;
    const entityToDelete = entities.find((entity) => {
      return this.selectedObjectId === entity.id;
    });
    this.delete.emit(entityToDelete);
  };

  public editObject = (): void => {
    this.edit.emit(this.selectedObjectId);
  };

  public applyFilter = (filterValue: string): void => {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  };

  public onRowClicked = (selectedId: number): void => {
    if (!!this.selectedObjectId && this.selectedObjectId === selectedId) {
      this.selectedObjectId = undefined;
    } else {
      this.selectedObjectId = selectedId;
    }
  };
}
