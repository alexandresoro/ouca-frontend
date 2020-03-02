import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import {
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
import * as _ from "lodash";
import { COORDINATES_SYSTEMS_CONFIG } from "ouca-common/coordinates-system";
import { FlatDonnee } from "ouca-common/flat-donnee.object";
import { interpretBrowserDateAsTimestampDate } from "src/app/modules/shared/helpers/time.helper";

@Component({
  selector: "table-donnees",
  styleUrls: ["./table-donnees.component.scss"],
  templateUrl: "./table-donnees.component.html",
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      )
    ])
  ]
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

  public selectedDonnee: FlatDonnee;

  constructor(private router: Router) {}

  private filterData = (data: FlatDonnee, filterValue: string): boolean => {
    const otherData = _.difference(_.keys(data), [
      "date",
      "comportements",
      "milieux"
    ]);

    const otherDataFilter = _.some(otherData, (dataField) => {
      if (_.isNumber(data[dataField])) {
        return "" + data[dataField] === filterValue;
      }

      return ("" + data[dataField])
        .trim()
        .toLowerCase()
        .includes(filterValue);
    });
    if (otherDataFilter) {
      return true;
    }

    const comportementsFilter = _.some(data.comportements, (comportement) => {
      return (
        _.toNumber(comportement.code) === _.toNumber(filterValue) ||
        comportement.libelle
          .trim()
          .toLowerCase()
          .includes(filterValue)
      );
    });
    if (comportementsFilter) {
      return true;
    }

    const milieuxFilter = _.some(data.milieux, (milieu) => {
      return (
        _.toNumber(milieu.code) === _.toNumber(filterValue) ||
        milieu.libelle
          .trim()
          .toLowerCase()
          .includes(filterValue)
      );
    });
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
    if (!!this.selectedDonnee && this.selectedDonnee.id === object.id) {
      this.selectedDonnee = null;
    } else {
      this.selectedDonnee = object;
    }
  };

  public editDonnee = (id: number): void => {
    this.router.navigate(["/creation"], { state: { id: id } });
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
}
