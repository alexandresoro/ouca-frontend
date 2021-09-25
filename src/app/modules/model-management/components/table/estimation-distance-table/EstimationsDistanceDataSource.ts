import { EntitesAvecLibelleOrderBy, EstimationDistanceWithCounts, SortOrder } from "src/app/model/graphql";
import { EstimationsDistanceGetService } from "src/app/services/estimations-distance-get.service";
import { EntitesTableDataSource } from "../entite-table/EntitesTableDataSource";

export class EstimationsDistanceDataSource extends EntitesTableDataSource<EstimationDistanceWithCounts> {

  constructor(private estimationsDistanceGetService: EstimationsDistanceGetService) {
    super();
  }

  loadEstimationsDistance(pageNumber: number, pageSize: number, orderBy: EntitesAvecLibelleOrderBy = undefined, sortOrder: SortOrder | "" = SortOrder.Asc, q: string = undefined): void {
    this.setLoadingState();

    this.estimationsDistanceGetService.fetch({ searchParams: { pageNumber, pageSize, q }, orderBy, sortOrder: sortOrder !== "" ? sortOrder : undefined }, { fetchPolicy: "network-only" }).subscribe(({ data }) => {
      this.disableLoadingState();
      const estimationsDistance = data?.paginatedEstimationsDistance?.result ?? [];
      this.countSubject.next(data?.paginatedEstimationsDistance?.count);
      this.entitesSubject.next(estimationsDistance);
    });
  }

}