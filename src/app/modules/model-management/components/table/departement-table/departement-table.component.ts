import { ChangeDetectionStrategy, Component } from "@angular/core";
import { DepartementsOrderBy, DepartementWithCounts } from "src/app/model/graphql";
import { DepartementsGetService } from "src/app/services/departements-get.service";
import { EntiteTableComponent } from "../entite-table/entite-table.component";
import { DepartementsDataSource } from "./DepartementsDataSource";

@Component({
  selector: "departement-table",
  styleUrls: ["./departement-table.component.scss"],
  templateUrl: "./departement-table.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartementTableComponent extends EntiteTableComponent<DepartementWithCounts, DepartementsDataSource> {
  public displayedColumns: string[] = [
    "code",
    "nbCommunes",
    "nbLieuxDits",
    "nbDonnees",
    "actions"
  ];

  constructor(private departementsGetService: DepartementsGetService) {
    super();
  }

  getNewDataSource(): DepartementsDataSource {
    return new DepartementsDataSource(this.departementsGetService);
  }

  loadEntities = (): void => {
    this.dataSource.loadDepartements(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active as DepartementsOrderBy,
      this.sort.direction,
      this.filterComponent?.input.nativeElement.value
    );
  }
}
