import { ChangeDetectionStrategy, Component } from "@angular/core";
import { EntitesAvecLibelleOrderBy, EstimationDistanceWithCounts } from "src/app/model/graphql";
import { EstimationsDistanceGetService } from "src/app/services/estimations-distance-get.service";
import { EntiteAvecLibelleTableComponent } from "../entite-avec-libelle-table/entite-avec-libelle-table.component";
import { EstimationsDistanceDataSource } from "./EstimationsDistanceDataSource";

@Component({
  selector: "estimation-distance-table",
  styleUrls: [
    "../entite-avec-libelle-table/entite-avec-libelle-table.component.scss"
  ],
  templateUrl:
    "../entite-avec-libelle-table/entite-avec-libelle-table.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EstimationDistanceTableComponent extends EntiteAvecLibelleTableComponent<EstimationDistanceWithCounts, EstimationsDistanceDataSource> {
  constructor(private estimationsDistanceGetService: EstimationsDistanceGetService) {
    super();
  }

  getNewDataSource(): EstimationsDistanceDataSource {
    return new EstimationsDistanceDataSource(this.estimationsDistanceGetService);
  }

  loadEntities = (): void => {
    this.dataSource.loadEstimationsDistance(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active as EntitesAvecLibelleOrderBy,
      this.sort.direction,
      this.filterComponent?.input.nativeElement.value
    );
  }
}
