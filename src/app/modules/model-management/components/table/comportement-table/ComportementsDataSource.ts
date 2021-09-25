import { ComportementsOrderBy, ComportementWithCounts, SortOrder } from "src/app/model/graphql";
import { ComportementsGetService } from "src/app/services/comportements-get.service";
import { EntitesTableDataSource } from "../entite-table/EntitesTableDataSource";

export class ComportementsDataSource extends EntitesTableDataSource<ComportementWithCounts> {

  constructor(private comportementsGetService: ComportementsGetService) {
    super();
  }

  loadComportements(pageNumber: number, pageSize: number, orderBy: ComportementsOrderBy = undefined, sortOrder: SortOrder | "" = SortOrder.Asc, q: string = undefined): void {
    this.setLoadingState();

    this.comportementsGetService.fetch({ searchParams: { pageNumber, pageSize, q }, orderBy, sortOrder: sortOrder !== "" ? sortOrder : undefined }, { fetchPolicy: "network-only" }).subscribe(({ data }) => {
      this.disableLoadingState();
      const comportements = data?.paginatedComportements?.result ?? [];
      this.countSubject.next(data?.paginatedComportements?.count);
      this.entitesSubject.next(comportements);
    });
  }

}