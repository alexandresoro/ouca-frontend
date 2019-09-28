import { Component, Input, SimpleChanges, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { EspeceWithNbDonnees } from "./espece-with-nb-donnees.object";

@Component({
  selector: "table-especes-with-nb-donnees",
  templateUrl: "./table-especes-with-nb-donnees.tpl.html"
})
export class TableEspecesWithNbDonneesComponent {
  public displayedColumns: string[] = [
    "classe",
    "code",
    "nomFrancais",
    "nomLatin",
    "nbDonnees"
  ];

  @Input() public especesToDisplay: EspeceWithNbDonnees[];

  public dataSource: MatTableDataSource<
    EspeceWithNbDonnees[]
  > = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public filterValue: string = "";

  public selectedEspece: EspeceWithNbDonnees;

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.especesToDisplay && !!changes.especesToDisplay.currentValue) {
      this.dataSource.data = changes.especesToDisplay.currentValue;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
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
