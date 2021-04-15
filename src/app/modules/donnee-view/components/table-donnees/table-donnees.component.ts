import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { format } from "date-fns";
import deburr from 'lodash.deburr';
import { COORDINATES_SYSTEMS_CONFIG } from 'src/app/model/coordinates-system/coordinates-system-list.object';
import { FlatDonnee } from 'src/app/model/types/flat-donnee.object';
import { interpretBrowserDateAsTimestampDate } from "src/app/modules/shared/helpers/time.helper";

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
export class TableDonneesComponent implements OnChanges, OnInit {
  public COMPORTEMENTS_INDEXES: number[] = [1, 2, 3, 4, 5, 6];
  public MILIEUX_INDEXES: number[] = [1, 2, 3, 4];

  public displayedColumns: string[] = [
    "codeEspece",
    "nomFrancais",
    "nombre",
    "sexe",
    "age",
    "departement",
    "codeCommune",
    "nomCommune",
    "lieudit",
    "date",
    "heure",
    "duree",
    "observateur"
  ];

  @Input() public donneesToDisplay: FlatDonnee[];

  public dataSource: MatTableDataSource<FlatDonnee> = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public filterValue: string = "";

  public filteringOnGoing: boolean = false;

  public selectedDonnee: FlatDonnee | null;

  constructor(private router: Router) { }

  private filterData = (data: FlatDonnee, filterValue: string): boolean => {
    const { date, comportements, milieux, ...otherDataKeyValue } = data;
    const otherData = Object.keys(otherDataKeyValue);


    const otherDataFilter = otherData?.some((dataField) => {
      if (Number.isFinite(data[dataField])) {
        return "" + data[dataField] === filterValue;
      }

      return ("" + data[dataField]).trim().toLowerCase().includes(filterValue);
    }) ?? false;
    if (otherDataFilter) {
      return true;
    }

    const comportementsFilter = data.comportements?.some((comportement) => {
      return (
        Number(comportement.code) === Number(filterValue) ||
        comportement.libelle.trim().toLowerCase().includes(filterValue)
      );
    }) ?? false;
    if (comportementsFilter) {
      return true;
    }

    const milieuxFilter = data.milieux?.some((milieu) => {
      return (
        Number(milieu.code) === Number(filterValue) ||
        milieu.libelle.trim().toLowerCase().includes(filterValue)
      );
    }) ?? false;
    if (milieuxFilter) {
      return true;
    }

    if (
      format(
        interpretBrowserDateAsTimestampDate(new Date(data.date)),
        "dd/MM/yyyy"
      ).includes(filterValue)
    ) {
      return true;
    }

    return false;
  };

  ngOnInit(): void {
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
    this.dataSource.filterPredicate = this.filterData;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.donneesToDisplay && !!changes.donneesToDisplay.currentValue) {
      this.dataSource.data = changes.donneesToDisplay.currentValue;
    }
  }

  public applyFilter(): void {
    this.filteringOnGoing = true;
    if (this.dataSource) {
      this.dataSource.filter = this.filterValue.trim().toLowerCase();

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
    this.filteringOnGoing = false;
  }

  public onRowClicked = (object: FlatDonnee): void => {
    if (this.selectedDonnee?.id === object.id) {
      this.selectedDonnee = null;
    } else {
      this.selectedDonnee = object;
    }
  };

  public editDonnee = (id: number): void => {
    this.router.navigate(["/creation"], { state: { id } });
  };

  public getCoordinatesSystem = (flatDonnee: FlatDonnee): string => {
    const systemType = flatDonnee.customizedCoordinatesSystem
      ? flatDonnee.customizedCoordinatesSystem
      : flatDonnee.coordinatesSystem;
    return COORDINATES_SYSTEMS_CONFIG[systemType].name;
  };

  public getCoordinatesUnitName = (flatDonnee: FlatDonnee): string => {
    const systemType = flatDonnee.customizedCoordinatesSystem
      ? flatDonnee.customizedCoordinatesSystem
      : flatDonnee.coordinatesSystem;
    return COORDINATES_SYSTEMS_CONFIG[systemType].unitName;
  };

  public getRowState = (row: FlatDonnee): string => {
    return this.selectedDonnee?.id === row.id ? "expanded" : "collapsed";
  };

  public getLongitude = (donnee: FlatDonnee): string => {
    return (donnee.longitude == null)
      ? "Non supporté"
      : donnee.longitude + " " + this.getCoordinatesUnitName(donnee);
  };

  public getLatitude = (donnee: FlatDonnee): string => {
    return (donnee.latitude == null)
      ? "Non supporté"
      : donnee.latitude + " " + this.getCoordinatesUnitName(donnee);
  };
}
