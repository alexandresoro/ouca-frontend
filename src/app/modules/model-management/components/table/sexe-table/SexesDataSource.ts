import { EntitesAvecLibelleOrderBy, SexeWithCounts, SortOrder } from "src/app/model/graphql";
import { SexesGetService } from "src/app/services/sexes-get.service";
import { EntitesTableDataSource } from "../entite-table/EntitesTableDataSource";

export class SexesDataSource extends EntitesTableDataSource<SexeWithCounts> {

  constructor(private sexesGetService: SexesGetService) {
    super();
  }

  loadSexes(pageNumber: number, pageSize: number, orderBy: EntitesAvecLibelleOrderBy = undefined, sortOrder: SortOrder | "" = SortOrder.Asc, q: string = undefined): void {
    this.setLoadingState();

    this.sexesGetService.fetch({ searchParams: { pageNumber, pageSize, q }, orderBy, sortOrder: sortOrder !== "" ? sortOrder : undefined }, { fetchPolicy: "network-only" }).subscribe(({ data }) => {
      this.disableLoadingState();
      const sexes = data?.paginatedSexes?.result ?? [];
      this.countSubject.next(data?.paginatedSexes?.count);
      this.entitesSubject.next(sexes);
    });
  }

}