import { Component, OnChanges, SimpleChanges } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Lieudit } from "basenaturaliste-model/lieudit.object";
import * as _ from "lodash";
import { EntiteSimpleTableComponent } from "../entite-simple-table/entite-simple-table.component";

interface LieuditRow {
  id: number;
  departement: string;
  codeCommune: number;
  nomCommune: string;
  nom: string;
  altitude: number;
  longitudeL2E: number;
  latitudeL2E: number;
  nbDonnees: number;
}

@Component({
  selector: "lieudit-table",
  templateUrl: "./lieudit-table.tpl.html"
})
export class LieuditTableComponent extends EntiteSimpleTableComponent<Lieudit>
  implements OnChanges {
  public displayedColumns: string[] = [
    "departement",
    "codeCommune",
    "nomCommune",
    "nom",
    "altitude",
    "longitudeL2E",
    "latitudeL2E",
    "nbDonnees"
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.objects && !!changes.objects.currentValue) {
      const rows: LieuditRow[] = [];
      _.forEach(changes.objects.currentValue, (value: Lieudit) => {
        rows.push(this.buildRowFromLieudit(value));
      });
      this.dataSource = new MatTableDataSource(rows);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  private buildRowFromLieudit(lieudit: Lieudit): LieuditRow {
    return {
      id: lieudit.id,
      departement: lieudit.commune.departement.code,
      codeCommune: lieudit.commune.code,
      nomCommune: lieudit.commune.nom,
      nom: lieudit.nom,
      altitude: lieudit.altitude,
      longitudeL2E: lieudit.coordinatesL2E.longitude,
      latitudeL2E: lieudit.coordinatesL2E.latitude,
      nbDonnees: lieudit.nbDonnees
    };
  }

  public onRowLieuditClicked(id: number): void {
    if (!!this.selectedObject && this.selectedObject.id === id) {
      this.selectedObject = undefined;
    } else {
      this.selectedObject = this.objects.filter(
        (lieudit) => lieudit.id === id
      )[0];
    }
  }
}
