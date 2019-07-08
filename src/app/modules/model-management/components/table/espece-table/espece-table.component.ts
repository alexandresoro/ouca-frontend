import { Component, SimpleChanges } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import * as _ from "lodash";
import { Espece } from "../../../../../../basenaturaliste-model/espece.object";
import { EntiteSimpleTableComponent } from "../entite-simple-table/entite-simple-table.component";

interface EspeceRow {
  id: number;
  classe: string;
  code: string;
  nomFrancais: string;
  nomLatin: string;
  nbDonnees: number;
}

@Component({
  selector: "espece-table",
  templateUrl: "./espece-table.tpl.html"
})
export class EspeceTableComponent extends EntiteSimpleTableComponent<Espece> {
  public displayedColumns: string[] = [
    "classe",
    "code",
    "nomFrancais",
    "nomLatin",
    "nbDonnees"
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.objects && !!changes.objects.currentValue) {
      const rows: EspeceRow[] = [];
      _.forEach(changes.objects.currentValue, (value: Espece) => {
        rows.push(this.buildRowFromEspece(value));
      });
      this.dataSource = new MatTableDataSource(rows);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  private buildRowFromEspece(espece: Espece): EspeceRow {
    return {
      id: espece.id,
      classe: espece.classe.libelle,
      code: espece.code,
      nomFrancais: espece.nomFrancais,
      nomLatin: espece.nomLatin,
      nbDonnees: espece.nbDonnees
    };
  }

  public onRowEspeceClicked(id: number) {
    if (!!this.selectedObject && this.selectedObject.id === id) {
      this.selectedObject = undefined;
    } else {
      this.selectedObject = this.objects.filter((espece) => espece.id === id)[0];
    }
  }
}
