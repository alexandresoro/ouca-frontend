import {
  ChangeDetectionStrategy,
  Component,
  Input,
  SimpleChanges,
  ViewChild
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import * as _ from "lodash";
import { EspeceWithNbDonnees } from "../../models/espece-with-nb-donnees.model";

@Component({
  selector: "table-especes-with-nb-donnees",
  styleUrls: ["./table-especes-with-nb-donnees.component.scss"],
  templateUrl: "./table-especes-with-nb-donnees.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
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
      this.dataSource.sortingDataAccessor = (
        data: unknown,
        sortHeaderId: string
      ): string => {
        if (typeof data[sortHeaderId] === "string") {
          return _.deburr(data[sortHeaderId].toLocaleLowerCase());
        }

        return data[sortHeaderId];
      };
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
