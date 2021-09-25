import { CommunesOrderBy, CommuneWithCounts, SortOrder } from "src/app/model/graphql";
import { CommunesGetService } from "src/app/services/communes-get.service";
import { EntitesTableDataSource } from "../entite-table/EntitesTableDataSource";

export class CommunesDataSource extends EntitesTableDataSource<CommuneWithCounts> {

  constructor(private communesGetService: CommunesGetService) {
    super();
  }

  loadCommunes(pageNumber: number, pageSize: number, orderBy: CommunesOrderBy = undefined, sortOrder: SortOrder | "" = SortOrder.Asc, q: string = undefined): void {
    this.setLoadingState();

    this.communesGetService.fetch({ searchParams: { pageNumber, pageSize, q }, orderBy, sortOrder: sortOrder !== "" ? sortOrder : undefined }, { fetchPolicy: "network-only" }).subscribe(({ data }) => {
      this.disableLoadingState();
      const communes = data?.paginatedCommunes?.result ?? [];
      this.countSubject.next(data?.paginatedCommunes?.count);
      this.entitesSubject.next(communes);
    });
  }

}