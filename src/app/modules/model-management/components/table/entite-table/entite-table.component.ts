import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { ApolloQueryResult } from "@apollo/client/core";
import { Apollo, QueryRef } from "apollo-angular";
import { DocumentNode } from "graphql";
import { fromEvent, merge, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, takeUntil, tap } from "rxjs/operators";
import { SortOrder } from "src/app/model/graphql";
import { EntiteSimple } from "../../../pages/entite-simple/entite-simple.component";
import { TableFilterFieldComponent } from "../../table-filter-field/table-filter-field.component";
import { EntitesTableDataSource } from "./EntitesTableDataSource";

@Component({
  template: ""
})
export abstract class EntiteTableComponent<T extends EntiteSimple, QR = unknown> implements OnInit, AfterViewInit, OnDestroy {
  @Output() public delete: EventEmitter<T> = new EventEmitter<T>();

  @Output() public edit: EventEmitter<number> = new EventEmitter<number>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(TableFilterFieldComponent) filterComponent: TableFilterFieldComponent;

  protected readonly destroy$ = new Subject();

  private filterChange$ = new Subject<string>();

  public dataSource: EntitesTableDataSource<T>;

  protected queryRef: QueryRef<QR>;

  protected abstract getQuery(): DocumentNode;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected onQueryResultValueChange = (qr: ApolloQueryResult<QR>): void => {
    /** */
  };

  constructor(
    private apollo: Apollo
  ) {
  }

  public updateEntities = async (): Promise<void> => {
    await this.queryRef?.refetch();
  }


  private getQueryFetchParams = () => {
    return {
      searchParams: {
        pageNumber: this.paginator.pageIndex,
        pageSize: this.paginator.pageSize,
        q: this.filterComponent?.input.nativeElement.value ?? undefined
      },
      orderBy: this.sort.active ?? undefined,
      sortOrder: this.sort.direction !== "" ? this.sort.direction : SortOrder.Asc
    }
  }

  private refreshEntities = async (): Promise<void> => {
    await this.queryRef?.refetch(this.getQueryFetchParams());
  }

  ngOnInit(): void {
    this.dataSource = new EntitesTableDataSource<T>();
  }

  ngAfterViewInit(): void {
    void this.refreshEntities(); // We need to put it here as the implementation will probably rely on the paginator/sort/filter elements to be initialized

    this.sort.sortChange.subscribe(() => this.paginator.firstPage());

    fromEvent(this.filterComponent?.input.nativeElement, 'keyup').pipe(
      takeUntil(this.destroy$),
      debounceTime(150),
      distinctUntilChanged(),
    )
      .subscribe(() => {
        this.paginator?.firstPage();
        void this.refreshEntities()
      });

    merge(this.sort.sortChange, this.paginator.page).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      void this.refreshEntities()
    });

    this.dataSource.count$
      .pipe(
        takeUntil(this.destroy$),
        tap((count) => {
          this.paginator.length = count;
        })
      )
      .subscribe();

    this.queryRef = this.apollo.watchQuery<QR>({
      query: this.getQuery(),
      variables: this.getQueryFetchParams()
    });

    this.queryRef.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(this.onQueryResultValueChange);

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
