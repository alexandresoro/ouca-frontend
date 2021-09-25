import { EntitesAvecLibelleOrderBy, ObservateurWithCounts, SortOrder } from "src/app/model/graphql";
import { ObservateursPaginatedService } from "src/app/services/observateurs-paginated.service";
import { EntitesTableDataSource } from "../entite-table/EntitesTableDataSource";

export class ObservateursDataSource extends EntitesTableDataSource<ObservateurWithCounts> {

  constructor(private observateursPaginatedService: ObservateursPaginatedService) {
    super();
  }

  loadObservateurs(pageNumber: number, pageSize: number, orderBy: EntitesAvecLibelleOrderBy = undefined, sortOrder: SortOrder | "" = SortOrder.Asc, q: string = undefined): void {
    this.setLoadingState();

    this.observateursPaginatedService.fetch({ searchParams: { pageNumber, pageSize, q }, orderBy, sortOrder: sortOrder !== "" ? sortOrder : undefined }, { fetchPolicy: "network-only" }).subscribe(({ data }) => {
      this.disableLoadingState();
      const observateurs = data?.paginatedObservateurs?.result ?? [];
      this.countSubject.next(data?.paginatedObservateurs?.count);
      this.entitesSubject.next(observateurs);
    });
  }

}