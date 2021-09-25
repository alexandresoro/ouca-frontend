import { ChangeDetectionStrategy, Component } from "@angular/core";
import { EstimationNombreOrderBy, EstimationNombreWithCounts } from "src/app/model/graphql";
import { EstimationsNombreGetService } from "src/app/services/estimations-nombre-get.service";
import { EntiteTableComponent } from "../entite-table/entite-table.component";
import { EstimationsNombreDataSource } from "./EstimationsNombreDataSource";

@Component({
  selector: "estimation-nombre-table",
  styleUrls: ["./estimation-nombre-table.component.scss"],
  templateUrl: "./estimation-nombre-table.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EstimationNombreTableComponent extends EntiteTableComponent<EstimationNombreWithCounts, EstimationsNombreDataSource> {
  public displayedColumns: string[] = [
    "libelle",
    "nonCompte",
    "nbDonnees",
    "actions"
  ];

  constructor(private estimationsNombreGetService: EstimationsNombreGetService) {
    super();
  }

  getNewDataSource(): EstimationsNombreDataSource {
    return new EstimationsNombreDataSource(this.estimationsNombreGetService);
  }

  loadEntities = (): void => {
    this.dataSource.loadEstimationsNombre(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active as EstimationNombreOrderBy,
      this.sort.direction,
      this.filterComponent?.input.nativeElement.value
    );
  }

  public getNonCompte = (nonCompte: boolean): string => {
    return nonCompte ? "Oui" : "Non";
  };
}
