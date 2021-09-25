import { AgeWithCounts, EntitesAvecLibelleOrderBy, SortOrder } from "src/app/model/graphql";
import { AgesPaginatedService } from "src/app/services/ages-paginated.service";
import { EntitesTableDataSource } from "../entite-table/EntitesTableDataSource";

export class AgesDataSource extends EntitesTableDataSource<AgeWithCounts> {

  constructor(private agePaginatedService: AgesPaginatedService) {
    super();
  }

  loadAges(pageNumber: number, pageSize: number, orderBy: EntitesAvecLibelleOrderBy = undefined, sortOrder: SortOrder | "" = SortOrder.Asc, q: string = undefined): void {
    this.setLoadingState();

    this.agePaginatedService.fetch({ searchParams: { pageNumber, pageSize, q }, orderBy, sortOrder: sortOrder !== "" ? sortOrder : undefined }, { fetchPolicy: "network-only" }).subscribe(({ data }) => {
      this.disableLoadingState();
      const ages = data?.paginatedAges?.result ?? [];
      this.countSubject.next(data?.paginatedAges?.count);
      this.entitesSubject.next(ages);
    });
  }

}