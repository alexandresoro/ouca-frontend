import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import { Component, Input, SimpleChanges, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "table-donnees",
  templateUrl: "./table-donnees.tpl.html",
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
export class TableDonneesComponent {
  public COMPORTEMENTS_INDEXES: number[] = [1, 2, 3, 4, 5, 6];
  public MILIEUX_INDEXES: number[] = [1, 2, 3, 4];

  public displayedColumns: string[] = [
    "code_espece",
    "nom_francais",
    "nombre",
    "sexe",
    "age",
    "departement",
    "code_commune",
    "nom_commune",
    "lieudit",
    "date",
    "heure",
    "duree",
    "observateur"
  ];

  @Input() public donneesToDisplay: any[];

  public dataSource: MatTableDataSource<any> = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public filterValue: string = "";

  public filteringOnGoing: boolean = false;

  public selectedDonnee: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.donneesToDisplay && !!changes.donneesToDisplay.currentValue) {
      this.dataSource.data = changes.donneesToDisplay.currentValue;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  public applyFilter(): void {
    this.filteringOnGoing = true;
    if (!!this.dataSource) {
      this.dataSource.filter = this.filterValue.trim().toLowerCase();

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
    this.filteringOnGoing = false;
  }

  public onRowClicked(object: any): void {
    if (!!this.selectedDonnee && this.selectedDonnee.id === object.id) {
      this.selectedDonnee = null;
    } else {
      this.selectedDonnee = object;
    }
  }
}
