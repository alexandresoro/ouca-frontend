import { EstimationNombreOrderBy, EstimationNombreWithCounts, SortOrder } from "src/app/model/graphql";
import { EstimationsNombreGetService } from "src/app/services/estimations-nombre-get.service";
import { EntitesTableDataSource } from "../entite-table/EntitesTableDataSource";

export class EstimationsNombreDataSource extends EntitesTableDataSource<EstimationNombreWithCounts> {

  constructor(private estimationsNombreGetService: EstimationsNombreGetService) {
    super();
  }

  loadEstimationsNombre(pageNumber: number, pageSize: number, orderBy: EstimationNombreOrderBy = undefined, sortOrder: SortOrder | "" = SortOrder.Asc, q: string = undefined): void {
    this.setLoadingState();

    this.estimationsNombreGetService.fetch({ searchParams: { pageNumber, pageSize, q }, orderBy, sortOrder: sortOrder !== "" ? sortOrder : undefined }, { fetchPolicy: "network-only" }).subscribe(({ data }) => {
      this.disableLoadingState();
      const estimationsNombre = data?.paginatedEstimationsNombre?.result ?? [];
      this.countSubject.next(data?.paginatedEstimationsNombre?.count);
      this.entitesSubject.next(estimationsNombre);
    });
  }

}