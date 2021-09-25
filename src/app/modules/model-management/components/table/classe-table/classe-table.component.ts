import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ClassesOrderBy, ClasseWithCounts } from "src/app/model/graphql";
import { ClassesGetService } from "src/app/services/classes-get.service";
import { EntiteTableComponent } from "../entite-table/entite-table.component";
import { ClassesDataSource } from "./ClassesDataSource";

@Component({
  selector: "classe-table",
  styleUrls: [
    "../entite-avec-libelle-table/entite-avec-libelle-table.component.scss",
    "./classe-table.component.scss"
  ],
  templateUrl: "./classe-table.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClasseTableComponent extends EntiteTableComponent<ClasseWithCounts, ClassesDataSource> {

  public displayedColumns: (ClassesOrderBy | string)[] = [
    "libelle",
    "nbEspeces",
    "nbDonnees",
    "actions"
  ];

  constructor(private classesGetService: ClassesGetService) {
    super();
  }

  getNewDataSource(): ClassesDataSource {
    return new ClassesDataSource(this.classesGetService);
  }

  loadEntities = (): void => {
    this.dataSource.loadClasses(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active as ClassesOrderBy,
      this.sort.direction,
      this.filterComponent?.input.nativeElement.value
    );
  }
}
