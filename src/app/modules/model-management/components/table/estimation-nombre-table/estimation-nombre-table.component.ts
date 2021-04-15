import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Observable } from "rxjs";
import { EstimationNombre } from 'src/app/model/types/estimation-nombre.object';
import { EntitiesStoreService } from "src/app/services/entities-store.service";
import { EntiteSimpleTableComponent } from "../entite-simple-table/entite-simple-table.component";

interface EstimationNombreRow {
  id: number;
  libelle: string;
  nonCompte: string;
  nbDonnees: number;
}

@Component({
  selector: "estimation-nombre-table",
  styleUrls: ["./estimation-nombre-table.component.scss"],
  templateUrl: "./estimation-nombre-table.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EstimationNombreTableComponent extends EntiteSimpleTableComponent<
EstimationNombre
> {
  public displayedColumns: string[] = ["libelle", "nonCompte", "nbDonnees"];

  constructor(private entitiesStoreService: EntitiesStoreService) {
    super();
  }

  ngOnInit(): void {
    this.initialize();
  }

  public getEntities$ = (): Observable<EstimationNombre[]> => {
    return this.entitiesStoreService.getEstimationNombres$();
  };

  protected getDataSource(
    estimations: EstimationNombre[]
  ): EstimationNombreRow[] {
    const rows: EstimationNombreRow[] = [];
    estimations?.forEach((value: EstimationNombre) => {
      rows.push(this.buildRowFromEstimation(value));
    });
    return rows;
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
}
