import { Component, Input, SimpleChanges, ViewChild } from "@angular/core";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";

@Component({
  selector: "table-donnees",
  templateUrl: "./table-donnees.tpl.html"
})
export class TableDonneesComponent {
  public COMPORTEMENTS_INDEXES: number[] = [1, 2, 3, 4, 5, 6];
  public MILIEUX_INDEXES: number[] = [1, 2, 3, 4];

  public displayedColumns: string[] = [
    "id",
    "observateur",
    "associes",
    "date",
    "heure",
    "duree",
    "departement",
    "code_commune",
    "nom_commune",
    "lieudit",
    "altitude",
    "longitude",
    "latitude",
    "temperature",
    "meteos",
    "classe",
    "code_espece",
    "nom_francais",
    "nom_latin",
    "nombre",
    "estimation_nombre",
    "sexe",
    "age",
    "estimation_distance",
    "distance",
    "regroupement",
    "code_comportement_1",
    "libelle_comportement_1",
    "code_comportement_2",
    "libelle_comportement_2",
    "code_comportement_3",
    "libelle_comportement_3",
    "code_comportement_4",
    "libelle_comportement_4",
    "code_comportement_5",
    "libelle_comportement_5",
    "code_comportement_6",
    "libelle_comportement_6",
    "code_milieu_1",
    "libelle_milieu_1",
    "code_milieu_2",
    "libelle_milieu_2",
    "code_milieu_3",
    "libelle_milieu_3",
    "code_milieu_4",
    "libelle_milieu_4",
    "commentaire"
  ];

  @Input() public donneesToDisplay: any[];

  public dataSource: MatTableDataSource<any> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

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
      this.selectedDonnee = undefined;
    } else {
      this.selectedDonnee = object;
    }
  }
}
