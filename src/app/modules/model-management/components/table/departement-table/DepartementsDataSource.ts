import { DepartementsOrderBy, DepartementWithCounts, SortOrder } from "src/app/model/graphql";
import { DepartementsGetService } from "src/app/services/departements-get.service";
import { EntitesTableDataSource } from "../entite-table/EntitesTableDataSource";

export class DepartementsDataSource extends EntitesTableDataSource<DepartementWithCounts> {

  constructor(private departementsGetService: DepartementsGetService) {
    super();
  }

  loadDepartements(pageNumber: number, pageSize: number, orderBy: DepartementsOrderBy = undefined, sortOrder: SortOrder | "" = SortOrder.Asc, q: string = undefined): void {
    this.setLoadingState();

    this.departementsGetService.fetch({ searchParams: { pageNumber, pageSize, q }, orderBy, sortOrder: sortOrder !== "" ? sortOrder : undefined }, { fetchPolicy: "network-only" }).subscribe(({ data }) => {
      this.disableLoadingState();
      const departements = data?.paginatedDepartements?.result ?? [];
      this.countSubject.next(data?.paginatedDepartements?.count);
      this.entitesSubject.next(departements);
    });
  }

}