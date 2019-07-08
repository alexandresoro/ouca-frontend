import { Component, SimpleChanges } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import * as _ from "lodash";
import { Commune } from "../../../../../../basenaturaliste-model/commune.object";
import { EntiteSimpleTableComponent } from "../entite-simple-table/entite-simple-table.component";
interface CommunetRow {
  id: number;
  departement: string;
  code: string;
  nom: string;
  nbLieuxdits: number;
  nbDonnees: number;
}

@Component({
  selector: "commune-table",
  templateUrl: "./commune-table.tpl.html"
})
export class CommuneTableComponent extends EntiteSimpleTableComponent<Commune> {
  public displayedColumns: string[] = [
    "departement",
    "code",
    "nom",
    "nbLieuxdits",
    "nbDonnees"
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.objects && !!changes.objects.currentValue) {
      const rows: CommunetRow[] = [];
      _.forEach(changes.objects.currentValue, (value: Commune) => {
        rows.push(this.buildRowFromLieudit(value));
      });
      this.dataSource = new MatTableDataSource(rows);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  private buildRowFromLieudit(commune: Commune): CommunetRow {
    return {
      id: commune.id,
      departement: commune.departement.code,
      code: commune.code,
      nom: commune.nom,
      nbLieuxdits: commune.nbLieuxdits,
      nbDonnees: commune.nbDonnees
    };
  }

  public onRowCommuneClicked(id: number) {
    if (!!this.selectedObject && this.selectedObject.id === id) {
      this.selectedObject = undefined;
    } else {
      this.selectedObject = this.objects.filter(
        (commune) => commune.id === id
      )[0];
    }
  }
}
