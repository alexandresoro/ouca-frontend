import { ClassesOrderBy, ClasseWithCounts, SortOrder } from "src/app/model/graphql";
import { ClassesGetService } from "src/app/services/classes-get.service";
import { EntitesTableDataSource } from "../entite-table/EntitesTableDataSource";

export class ClassesDataSource extends EntitesTableDataSource<ClasseWithCounts> {

  constructor(private classesGetService: ClassesGetService) {
    super();
  }

  loadClasses(pageNumber: number, pageSize: number, orderBy: ClassesOrderBy = undefined, sortOrder: SortOrder | "" = SortOrder.Asc, q: string = undefined): void {
    this.setLoadingState();

    this.classesGetService.fetch({ searchParams: { pageNumber, pageSize, q }, orderBy, sortOrder: sortOrder !== "" ? sortOrder : undefined }, { fetchPolicy: "network-only" }).subscribe(({ data }) => {
      this.disableLoadingState();
      const especes = data?.paginatedClasses?.result ?? [];
      this.countSubject.next(data?.paginatedClasses?.count);
      this.entitesSubject.next(especes);
    });
  }

}