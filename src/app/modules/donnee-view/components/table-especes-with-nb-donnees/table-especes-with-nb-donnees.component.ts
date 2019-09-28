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
import { EspeceWithNbDonnees } from "./espece-with-nb-donnees.object";

@Component({
  selector: "table-especes-with-nb-donnees",
  templateUrl: "./table-especes-with-nb-donnees.tpl.html",
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
export class TableEspecesWithNbDonneesComponent {
  public displayedColumns: string[] = [
    "classe",
    "code",
    "nom_francais",
    "nom_latin",
    "nb_donnees"
  ];

  @Input() public especesToDisplay: EspeceWithNbDonnees[];

  public dataSource: MatTableDataSource<
    EspeceWithNbDonnees[]
  > = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public filterValue: string = "";

  public filteringOnGoing: boolean = false;

  public selectedEspece: EspeceWithNbDonnees;

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.especesToDisplay && !!changes.especesToDisplay.currentValue) {
      this.dataSource.data = changes.especesToDisplay.currentValue;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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

  public onRowClicked = (espece: EspeceWithNbDonnees): void => {
    if (this.selectedEspece && this.selectedEspece.code === espece.code) {
      this.selectedEspece = null;
    } else {
      this.selectedEspece = espece;
    }
  };
}
