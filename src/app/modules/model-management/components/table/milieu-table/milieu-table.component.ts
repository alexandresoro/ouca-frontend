import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MilieuWithCounts, MilieuxOrderBy } from "src/app/model/graphql";
import { MilieuxGetService } from "src/app/services/milieux-get.service";
import { EntiteTableComponent } from "../entite-table/entite-table.component";
import { MilieuxDataSource } from "./MilieuxDataSource";

@Component({
  selector: "milieu-table",
  styleUrls: ["./milieu-table.component.scss"],
  templateUrl: "./milieu-table.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MilieuTableComponent extends EntiteTableComponent<MilieuWithCounts, MilieuxDataSource> {

  public displayedColumns: (MilieuxOrderBy | string)[] = [
    "code",
    "libelle",
    "nbDonnees",
    "actions"
  ];

  constructor(private milieuxGetService: MilieuxGetService) {
    super();
  }

  getNewDataSource(): MilieuxDataSource {
    return new MilieuxDataSource(this.milieuxGetService);
  }

  loadEntities = (): void => {
    this.dataSource.loadMilieux(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active as MilieuxOrderBy,
      this.sort.direction,
      this.filterComponent?.input.nativeElement.value
    );
  }
}
