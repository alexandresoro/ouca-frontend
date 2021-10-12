import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,

  SimpleChanges,
  ViewChild
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Apollo, gql } from "apollo-angular";
import deburr from 'lodash.deburr';
import { combineLatest, Observable, Subject } from "rxjs";
import { map, takeUntil } from "rxjs/operators";
import { Classe, Espece } from "src/app/model/graphql";

export type EspeceWithNbDonnees = Omit<Espece, 'classe'> & {
  classe?: string
  nbDonnees: number
}

type TableEspecesWithNbDonneesQueryResult = {
  classes: Classe[]
}

const TABLE_ESPECES_WITH_NB_DONNEES_QUERY = gql`
  query {
    classes {
      id
      libelle
    }
  }
`;

@Component({
  selector: "table-especes-with-nb-donnees",
  styleUrls: ["./table-especes-with-nb-donnees.component.scss"],
  templateUrl: "./table-especes-with-nb-donnees.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableEspecesWithNbDonneesComponent implements OnChanges, AfterViewInit, OnDestroy {

  private readonly destroy$ = new Subject();

  public displayedColumns: string[] = [
    "classe",
    "code",
    "nomFrancais",
    "nomLatin",
    "nbDonnees"
  ];

  @Input() public especesToDisplay: EspeceWithNbDonnees[];

  public dataSource: MatTableDataSource<
    EspeceWithNbDonnees
  > = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public filterValue: string = "";

  public selectedEspece: EspeceWithNbDonnees;

  private especesToDisplay$: Subject<EspeceWithNbDonnees[]> = new Subject();

  private classes$: Observable<Classe[]>;

  constructor(
    private apollo: Apollo
  ) {

    this.classes$ = this.apollo.watchQuery<TableEspecesWithNbDonneesQueryResult>({
      query: TABLE_ESPECES_WITH_NB_DONNEES_QUERY
    }).valueChanges.pipe(
      takeUntil(this.destroy$),
      map(({ data }) => data?.classes)
    );

    combineLatest([
      this.especesToDisplay$,
      this.classes$
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(([especesToDisplay, classes]) => {
      this.dataSource.data = especesToDisplay.map((espece) => {
        const classe = classes?.find(classe => classe.id === espece.classeId)?.libelle
        return {
          ...espece,
          classe
        };
      });
    });

  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (
      data: unknown,
      sortHeaderId: string
    ): string => {
      if (typeof data[sortHeaderId] === "string") {
        return deburr(data[sortHeaderId].toLocaleLowerCase());
      }

      return data[sortHeaderId];
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.especesToDisplay && !!changes.especesToDisplay.currentValue) {
      this.especesToDisplay$.next(changes.especesToDisplay.currentValue);
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public applyFilter(): void {
    if (this.dataSource) {
      this.dataSource.filter = this.filterValue.trim().toLowerCase();

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }

  public onRowClicked = (espece: EspeceWithNbDonnees): void => {
    if (this.selectedEspece && this.selectedEspece.code === espece.code) {
      this.selectedEspece = null;
    } else {
      this.selectedEspece = espece;
    }
  };
}
