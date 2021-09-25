import { MilieuWithCounts, MilieuxOrderBy, SortOrder } from "src/app/model/graphql";
import { MilieuxGetService } from "src/app/services/milieux-get.service";
import { EntitesTableDataSource } from "../entite-table/EntitesTableDataSource";

export class MilieuxDataSource extends EntitesTableDataSource<MilieuWithCounts> {

  constructor(private milieuxGetService: MilieuxGetService) {
    super();
  }

  loadMilieux(pageNumber: number, pageSize: number, orderBy: MilieuxOrderBy = undefined, sortOrder: SortOrder | "" = SortOrder.Asc, q: string = undefined): void {
    this.setLoadingState();

    this.milieuxGetService.fetch({ searchParams: { pageNumber, pageSize, q }, orderBy, sortOrder: sortOrder !== "" ? sortOrder : undefined }, { fetchPolicy: "network-only" }).subscribe(({ data }) => {
      this.disableLoadingState();
      const milieux = data?.paginatedMilieux?.result ?? [];
      this.countSubject.next(data?.paginatedMilieux?.count);
      this.entitesSubject.next(milieux);
    });
  }

}