import { Component } from "@angular/core";
import * as _ from "lodash";
import { Observable } from "rxjs";
import { UICommune } from "src/app/models/commune.model";
import { EntitiesStoreService } from "src/app/services/entities-store.service";
import { EntiteSimpleTableComponent } from "../entite-simple-table/entite-simple-table.component";
interface CommunetRow {
  id: number;
  departement: string;
  code: number;
  nom: string;
  nbLieuxdits: number;
  nbDonnees: number;
}

@Component({
  selector: "commune-table",
  styleUrls: ["./commune-table.component.scss"],
  templateUrl: "./commune-table.tpl.html"
})
export class CommuneTableComponent extends EntiteSimpleTableComponent<
  UICommune
> {
  public displayedColumns: string[] = [
    "departement",
    "code",
    "nom",
    "nbLieuxdits",
    "nbDonnees"
  ];

  constructor(private entitiesStoreService: EntitiesStoreService) {
    super();
  }

  ngOnInit(): void {
    this.initialize();
  }

  protected getEntities$ = (): Observable<UICommune[]> => {
    return this.entitiesStoreService.getCommunes$();
  };

  protected getDataSource(communes: UICommune[]): CommunetRow[] {
    const rows: CommunetRow[] = [];
    _.forEach(communes, (commune: UICommune) => {
      rows.push(this.buildRowFromLieudit(commune));
    });
    return rows;
  }

  private buildRowFromLieudit(commune: UICommune): CommunetRow {
    return {
      id: commune.id,
      departement: commune.departement.code,
      code: commune.code,
      nom: commune.nom,
      nbLieuxdits: commune.nbLieuxdits,
      nbDonnees: commune.nbDonnees
    };
  }
}
