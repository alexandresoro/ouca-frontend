import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CommunesOrderBy, CommuneWithCounts } from "src/app/model/graphql";
import { CommunesGetService } from "src/app/services/communes-get.service";
import { EntiteTableComponent } from "../entite-table/entite-table.component";
import { CommunesDataSource } from "./CommunesDataSource";

@Component({
  selector: "commune-table",
  styleUrls: ["./commune-table.component.scss"],
  templateUrl: "./commune-table.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommuneTableComponent extends EntiteTableComponent<CommuneWithCounts, CommunesDataSource> {
  public displayedColumns: string[] = [
    "departement",
    "code",
    "nom",
    "nbLieuxDits",
    "nbDonnees",
    "actions"
  ];

  constructor(private communesGetService: CommunesGetService) {
    super();
  }

  getNewDataSource(): CommunesDataSource {
    return new CommunesDataSource(this.communesGetService);
  }

  loadEntities = (): void => {
    this.dataSource.loadCommunes(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active as CommunesOrderBy,
      this.sort.direction,
      this.filterComponent?.input.nativeElement.value
    );
  }
}
