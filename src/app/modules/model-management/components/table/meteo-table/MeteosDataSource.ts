import { EntitesAvecLibelleOrderBy, MeteoWithCounts, SortOrder } from "src/app/model/graphql";
import { MeteosGetService } from "src/app/services/meteos-get.service";
import { EntitesTableDataSource } from "../entite-table/EntitesTableDataSource";

export class MeteosDataSource extends EntitesTableDataSource<MeteoWithCounts> {

  constructor(private meteosGetService: MeteosGetService) {
    super();
  }

  loadMeteos(pageNumber: number, pageSize: number, orderBy: EntitesAvecLibelleOrderBy = undefined, sortOrder: SortOrder | "" = SortOrder.Asc, q: string = undefined): void {
    this.setLoadingState();

    this.meteosGetService.fetch({ searchParams: { pageNumber, pageSize, q }, orderBy, sortOrder: sortOrder !== "" ? sortOrder : undefined }, { fetchPolicy: "network-only" }).subscribe(({ data }) => {
      this.disableLoadingState();
      const meteos = data?.paginatedMeteos?.result ?? [];
      this.countSubject.next(data?.paginatedMeteos?.count);
      this.entitesSubject.next(meteos);
    });
  }

}