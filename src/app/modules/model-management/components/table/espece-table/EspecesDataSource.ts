import { EspecesOrderBy, EspeceWithCounts, SortOrder } from "src/app/model/graphql";
import { EspecesGetService } from "src/app/services/especes-get.service";
import { EntitesTableDataSource } from "../entite-table/EntitesTableDataSource";

export class EspecesDataSource extends EntitesTableDataSource<EspeceWithCounts> {

  constructor(private especesGetService: EspecesGetService) {
    super();
  }

  loadEspeces(pageNumber: number, pageSize: number, orderBy: EspecesOrderBy = undefined, sortOrder: SortOrder | "" = SortOrder.Asc, q: string = undefined): void {
    this.setLoadingState();

    this.especesGetService.fetch({ searchParams: { pageNumber, pageSize, q }, orderBy, sortOrder: sortOrder !== "" ? sortOrder : undefined }, { fetchPolicy: "network-only" }).subscribe(({ data }) => {
      this.disableLoadingState();
      const especes = data?.paginatedEspeces?.result ?? [];
      this.countSubject.next(data?.paginatedEspeces?.count);
      this.entitesSubject.next(especes);
    });
  }

}