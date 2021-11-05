import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,

  OnDestroy,
  OnInit,
  ViewChild
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { Apollo, gql, QueryRef } from "apollo-angular";
import { BehaviorSubject, merge, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { EspecesOrderBy, EspecesPaginatedResult, QueryPaginatedSearchEspecesArgs, SearchDonneeCriteria, SortOrder } from "src/app/model/graphql";
import { SearchCriteriaService } from "../../services/search-criteria.service";
import { TableSearchEspecesDataSource } from "./TableSearchEspecesDataSource";

type PaginatedSearchEspecesQueryResult = {
  paginatedSearchEspeces: EspecesPaginatedResult
}

const PAGINATED_SEARCH_ESPECES_QUERY = gql`
  query PaginatedSearchEspeces($searchParams: SearchDonneeParams, $searchCriteria: SearchDonneeCriteria, $orderBy: EspecesOrderBy, $sortOrder: SortOrder) {
    paginatedSearchEspeces (searchParams: $searchParams, searchCriteria: $searchCriteria, orderBy: $orderBy, sortOrder: $sortOrder) {
      count
      result {
        id
        code
        nomFrancais
        nomLatin
        nbDonnees
        classe {
          id
          libelle
        }
      }
    }
  }
`;

@Component({
  selector: "table-especes-with-nb-donnees",
  styleUrls: ["./table-especes-with-nb-donnees.component.scss"],
  templateUrl: "./table-especes-with-nb-donnees.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableEspecesWithNbDonneesComponent implements OnInit, AfterViewInit, OnDestroy {

  private readonly destroy$ = new Subject();

  public displayedColumns: EspecesOrderBy[] = [
    "nomClasse",
    "code",
    "nomFrancais",
    "nomLatin",
    "nbDonnees"
  ];

  public dataSource: TableSearchEspecesDataSource;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private searchDonneeCriteria$: BehaviorSubject<SearchDonneeCriteria> = new BehaviorSubject<SearchDonneeCriteria>(null);

  private queryRef: QueryRef<PaginatedSearchEspecesQueryResult, QueryPaginatedSearchEspecesArgs>;

  constructor(
    private apollo: Apollo,
    private searchCriteriaService: SearchCriteriaService
  ) {
  }

  private getQueryFetchParams = (): QueryPaginatedSearchEspecesArgs => {
    return {
      searchParams: {
        pageNumber: this.paginator.pageIndex,
        pageSize: this.paginator.pageSize
      },
      orderBy: this.sort.active as EspecesOrderBy ?? undefined,
      sortOrder: this.sort.direction !== "" ? this.sort.direction : SortOrder.Asc,
      searchCriteria: this.searchDonneeCriteria$.value
    }
  }

  private refreshEntities = async (): Promise<void> => {
    await this.queryRef?.refetch(this.getQueryFetchParams());
  }

  ngOnInit(): void {
    this.dataSource = new TableSearchEspecesDataSource();

    this.searchCriteriaService.getCurrentSearchDonneeCriteria$()
      .pipe(
        takeUntil(this.destroy$)
      ).subscribe((searchDonneeCriteria) => {
        this.searchDonneeCriteria$.next(searchDonneeCriteria);
      });
  }

  ngAfterViewInit(): void {
    void this.refreshEntities(); // We need to put it here as the implementation will probably rely on the paginator/sort/filter elements to be initialized

    this.sort.sortChange.subscribe(() => this.paginator.firstPage());

    merge(this.sort.sortChange, this.paginator.page).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      void this.refreshEntities()
    });

    this.searchDonneeCriteria$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.paginator?.firstPage();
      void this.refreshEntities()
    })

    this.dataSource.count$
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((count) => {
        this.paginator.length = count;
      });

    this.queryRef = this.apollo.watchQuery<PaginatedSearchEspecesQueryResult, QueryPaginatedSearchEspecesArgs>({
      query: PAGINATED_SEARCH_ESPECES_QUERY,
      variables: this.getQueryFetchParams()
    });

    this.queryRef.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(({ data }) => {
      const especes = data?.paginatedSearchEspeces?.result ?? [];
      this.dataSource.updateValues(especes, data?.paginatedSearchEspeces?.count);
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
