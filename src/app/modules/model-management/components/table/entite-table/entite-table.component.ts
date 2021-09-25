import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { fromEvent, merge, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, takeUntil, tap } from "rxjs/operators";
import { EntiteSimple } from 'src/app/model/types/entite-simple.object';
import { TableFilterFieldComponent } from "../../table-filter-field/table-filter-field.component";
import { EntitesTableDataSource } from "./EntitesTableDataSource";

@Component({
  template: ""
})
export abstract class EntiteTableComponent<T extends EntiteSimple, U extends EntitesTableDataSource<T> = EntitesTableDataSource<T>> implements OnInit, AfterViewInit, OnDestroy {
  @Output() public delete: EventEmitter<T> = new EventEmitter<T>();

  @Output() public edit: EventEmitter<number> = new EventEmitter<number>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(TableFilterFieldComponent) filterComponent: TableFilterFieldComponent;

  protected readonly destroy$ = new Subject();

  private filterChange$ = new Subject<string>();

  public dataSource: U;

  protected abstract getNewDataSource(): U;

  protected abstract loadEntities(): void;

  protected customOnInit = (): void => {
    /** */
  }

  ngOnInit(): void {
    this.dataSource = this.getNewDataSource();
    this.customOnInit();
  }

  ngAfterViewInit(): void {
    this.loadEntities(); // We need to put it here as the implementation will probably rely on the paginator/sort/filter elements to be initialized

    this.sort.sortChange.subscribe(() => this.paginator.firstPage());

    fromEvent(this.filterComponent?.input.nativeElement, 'keyup').pipe(
      takeUntil(this.destroy$),
      debounceTime(150),
      distinctUntilChanged(),
    )
      .subscribe(() => {
        this.paginator?.firstPage();
        this.loadEntities()
      });

    merge(this.sort.sortChange, this.paginator.page).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.loadEntities()
    });

    this.dataSource.count$
      .pipe(
        takeUntil(this.destroy$),
        tap((count) => {
          this.paginator.length = count;
        })
      )
      .subscribe();
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public deleteObject = (entityToDelete: T): void => {
    this.delete.emit(entityToDelete);
  };

  public editObject = (selectedObjectId: number): void => {
    this.edit.emit(selectedObjectId);
  };

  public applyFilter = (filterValue: string): void => {
    this.filterChange$.next(filterValue.trim().toLowerCase());
  };
}
