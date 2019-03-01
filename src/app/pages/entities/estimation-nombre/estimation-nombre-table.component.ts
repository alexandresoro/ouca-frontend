import { Component, SimpleChanges } from "@angular/core";
import { MatTableDataSource } from "@angular/material";
import * as _ from "lodash";
import { EstimationNombre } from "../../../model/estimation-nombre.object";
import { EntiteSimpleTableComponent } from "../entite-simple/entite-simple-table.component";

interface EstimationNombreRow {
  id: number;
  libelle: string;
  nonCompte: string;
  nbDonnees: number;
}

@Component({
  selector: "estimation-nombre-table",
  templateUrl: "./estimation-nombre-table.tpl.html"
})
export class EstimationNombreTableComponent extends EntiteSimpleTableComponent<
  EstimationNombre
> {
  public displayedColumns: string[] = ["libelle", "nonCompte", "nbDonnees"];

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.objects && !!changes.objects.currentValue) {
      const rows: EstimationNombreRow[] = [];
      _.forEach(changes.objects.currentValue, (value: EstimationNombre) => {
        rows.push(this.buildRowFromEstimation(value));
      });
      this.dataSource = new MatTableDataSource(rows);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  private buildRowFromEstimation(
    estimation: EstimationNombre
  ): EstimationNombreRow {
    return {
      id: estimation.id,
      libelle: estimation.libelle,
      nonCompte: estimation.nonCompte ? "Oui" : "Non",
      nbDonnees: estimation.nbDonnees
    };
  }

  public onRowEstimationNombreClicked(id: number) {
    if (!!this.selectedObject && this.selectedObject.id === id) {
      this.selectedObject = undefined;
    } else {
      this.selectedObject = this.objects.filter(
        (estimation) => estimation.id === id
      )[0];
    }
  }
}
