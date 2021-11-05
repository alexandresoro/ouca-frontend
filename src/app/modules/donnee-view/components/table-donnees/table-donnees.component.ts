import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
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
import { Router } from "@angular/router";
import { Apollo, gql, QueryRef } from "apollo-angular";
import { BehaviorSubject, merge, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { COORDINATES_SYSTEMS_CONFIG } from 'src/app/model/coordinates-system/coordinates-system-list.object';
import { Comportement, Donnee, Inventaire, Meteo, Nicheur, Observateur, PaginatedSearchDonneesResult, QueryPaginatedSearchDonneesArgs, SearchDonneeCriteria, SearchDonneesOrderBy, SortOrder } from "src/app/model/graphql";
import { NICHEUR_VALUES } from "src/app/model/types/nicheur.model";
import { SearchCriteriaService } from "../../services/search-criteria.service";
import { TableSearchDonneesDataSource } from "./TableSearchDonneesDataSource";

type PaginatedSearchDonneesQueryResult = {
  paginatedSearchDonnees: PaginatedSearchDonneesResult
}

const PAGINATED_SEARCH_DONNEES_QUERY = gql`
  query PaginatedSearchDonnees($sortOrder: SortOrder, $orderBy: SearchDonneesOrderBy, $searchParams: SearchDonneeParams, $searchCriteria: SearchDonneeCriteria) {
    paginatedSearchDonnees(sortOrder: $sortOrder, orderBy: $orderBy, searchParams: $searchParams, searchCriteria: $searchCriteria) {
      count
      result {
        id
        inventaire {
          id
          observateur {
            id
            libelle
          }
          associes {
            id
            libelle
          }
          date
          heure
          duree
          lieuDit {
            id
            nom
            altitude
            longitude
            latitude
            coordinatesSystem
            commune {
              id
              code
              nom
              departement {
                id
                code
              }
            }
          }
          customizedCoordinates {
            altitude
            longitude
            latitude
            system
          }
          temperature
          meteos {
            id
            libelle
          }
        }
        espece {
          id
          code
          nomFrancais
          nomLatin
          classe {
            id
            libelle
          }
        }
        sexe {
          id
          libelle
        }
        age {
          id
          libelle
        }
        estimationNombre {
          id
          libelle
          nonCompte
        }
        nombre
        estimationDistance {
          id
          libelle
        }
        distance
        regroupement
        comportements {
          id
          code
          libelle
          nicheur
        }
        milieux {
          id
          code
          libelle
        }
        commentaire
      }
    }
  }
`;

@Component({
  selector: "table-donnees",
  styleUrls: ["./table-donnees.component.scss"],
  templateUrl: "./table-donnees.component.html",
  animations: [
    trigger("detailExpand", [
      state(
        "collapsed, void",
        style({ height: "0px", minHeight: "0", visibility: "hidden" })
      ),
      state("expanded", style({ height: "*", visibility: "visible" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      )
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableDonneesComponent implements OnInit, AfterViewInit, OnDestroy {

  private readonly destroy$ = new Subject();

  public displayedColumns: SearchDonneesOrderBy[] = [
    "codeEspece",
    "nomFrancais",
    "nombre",
    "sexe",
    "age",
    "departement",
    "codeCommune",
    "nomCommune",
    "lieuDit",
    "date",
    "heure",
    "duree",
    "observateur"
  ];

  public dataSource: TableSearchDonneesDataSource;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private searchDonneeCriteria$: BehaviorSubject<SearchDonneeCriteria> = new BehaviorSubject<SearchDonneeCriteria>(null);

  private queryRef: QueryRef<PaginatedSearchDonneesQueryResult, QueryPaginatedSearchDonneesArgs>;

  public selectedDonnee: Donnee | null;

  constructor(
    private router: Router,
    private apollo: Apollo,
    private searchCriteriaService: SearchCriteriaService
  ) { }

  private getQueryFetchParams = (): QueryPaginatedSearchDonneesArgs => {
    return {
      searchParams: {
        pageNumber: this.paginator.pageIndex,
        pageSize: this.paginator.pageSize
      },
      orderBy: this.sort.active as SearchDonneesOrderBy ?? undefined,
      sortOrder: this.sort.direction !== "" ? this.sort.direction : SortOrder.Asc,
      searchCriteria: this.searchDonneeCriteria$.value
    }
  }

  private refreshEntities = async (): Promise<void> => {
    await this.queryRef?.refetch(this.getQueryFetchParams());
  }

  ngOnInit(): void {
    this.dataSource = new TableSearchDonneesDataSource();

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

    this.queryRef = this.apollo.watchQuery<PaginatedSearchDonneesQueryResult, QueryPaginatedSearchDonneesArgs>({
      query: PAGINATED_SEARCH_DONNEES_QUERY,
      variables: this.getQueryFetchParams()
    });

    this.queryRef.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(({ data }) => {
      const donnees = data?.paginatedSearchDonnees?.result ?? [];
      this.dataSource.updateValues(donnees, data?.paginatedSearchDonnees?.count);
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onRowClicked = (object: Donnee): void => {
    if (this.selectedDonnee?.id === object.id) {
      this.selectedDonnee = null;
    } else {
      this.selectedDonnee = object;
    }
  };

  public editDonnee = (id: number): void => {
    this.router.navigate(["/creation"], { state: { id } });
  };

  public getRowState = (row: Donnee): string => {
    return this.selectedDonnee?.id === row.id ? "expanded" : "collapsed";
  };

  public getLongitude = (inventaire: Inventaire): string => {
    const hasCustomizedCoordinates = !!inventaire?.customizedCoordinates;
    const value = hasCustomizedCoordinates ? inventaire?.customizedCoordinates?.longitude : inventaire?.lieuDit?.longitude;
    const system = hasCustomizedCoordinates ? inventaire?.customizedCoordinates?.system : inventaire?.lieuDit?.coordinatesSystem;
    const unit = COORDINATES_SYSTEMS_CONFIG[system].unitName

    return `${value} ${unit}`;
  };

  public getLatitude = (inventaire: Inventaire): string => {
    const hasCustomizedCoordinates = !!inventaire?.customizedCoordinates;
    const value = hasCustomizedCoordinates ? inventaire?.customizedCoordinates?.latitude : inventaire?.lieuDit?.latitude;
    const system = hasCustomizedCoordinates ? inventaire?.customizedCoordinates?.system : inventaire?.lieuDit?.coordinatesSystem;
    const unit = COORDINATES_SYSTEMS_CONFIG[system].unitName

    return `${value} ${unit}`;
  };

  public getAltitude = (inventaire: Inventaire): number => {
    return (inventaire?.customizedCoordinates) ? (inventaire?.customizedCoordinates?.altitude) : inventaire?.lieuDit?.altitude;
  }

  public getAssocies = (associes: Observateur[]): string => {
    return associes?.map(associe => associe.libelle)?.join(",") ?? "";
  }

  public getMeteos = (meteos: Meteo[]): string => {
    return meteos?.map(meteos => meteos.libelle)?.join(",") ?? "";
  }

  public getNicheurStatusToDisplay = (comportements: Comportement[]): string => {

    // Compute nicheur status for the Donnée (i.e. highest nicheur status of the comportements)
    // First we keep only the comportements having a nicheur status
    const nicheurStatuses: Nicheur[] = comportements?.filter(
      (comportement) => {
        return !!comportement.nicheur;
      }
    ).map(
      (comportement) => {
        return comportement.nicheur;
      }
    ) ?? [];

    // Then we keep the highest nicheur status
    const nicheurStatusCode = nicheurStatuses?.length && nicheurStatuses.reduce(
      (nicheurStatusOne, nicheurStatusTwo) => {
        return NICHEUR_VALUES[nicheurStatusOne].weight >= NICHEUR_VALUES[nicheurStatusTwo].weight ? nicheurStatusOne : nicheurStatusTwo
      }
    );

    return nicheurStatusCode ? NICHEUR_VALUES[nicheurStatusCode].name : "Non";
  }

}
