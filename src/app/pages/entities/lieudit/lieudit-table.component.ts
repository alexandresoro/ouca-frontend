import {
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from "@angular/core";
import * as _ from "lodash";
import {
  MatPaginator,
  MatSort,
  MatTableDataSource
} from "../../../../../node_modules/@angular/material";
import { Lieudit } from "../../../model/lieudit.object";
import { EntiteSimpleTableComponent } from "../entite-simple/entite-simple-table.component";

interface LieuDitRow {
  departement: string;
  codeCommune: string;
  nomCommune: string;
  nom: string;
  altitude: number;
  longitude: number;
  latitude: number;
}

@Component({
  selector: "lieudit-table",
  templateUrl: "./lieudit-table.tpl.html"
})
export class LieuditTableComponent extends EntiteSimpleTableComponent<Lieudit>
  implements OnChanges {
  public dataSource: MatTableDataSource<LieuDitRow>;

  public displayedColumns: string[] = [
    "departement",
    "codeCommune",
    "nomCommune",
    "nom",
    "altitude",
    "longitude",
    "latitude"
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnChanges(changes: SimpleChanges) {
    if (!!changes.objects && !!changes.objects.currentValue) {
      const rows: LieuDitRow[] = [];
      _.forEach(changes.objects.currentValue, (value: Lieudit) => {
        rows.push(this.buildRowFromLieuDit(value));
      });
      this.dataSource = new MatTableDataSource(rows);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private buildRowFromLieuDit(lieudit: Lieudit): LieuDitRow {
    return {
      departement: lieudit.commune.departement.code,
      codeCommune: lieudit.commune.code,
      nomCommune: lieudit.commune.nom,
      nom: lieudit.nom,
      altitude: lieudit.altitude,
      longitude: lieudit.longitude,
      latitude: lieudit.latitude
    };
  }
}
