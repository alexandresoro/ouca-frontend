import { ChangeDetectionStrategy, Component } from "@angular/core";
import { EspecesOrderBy, EspeceWithCounts } from "src/app/model/graphql";
import { EspecesGetService } from "src/app/services/especes-get.service";
import { EntiteTableComponent } from "../entite-table/entite-table.component";
import { EspecesDataSource } from "./EspecesDataSource";

@Component({
  selector: "espece-table",
  styleUrls: ["./espece-table.component.scss"],
  templateUrl: "./espece-table.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EspeceTableComponent extends EntiteTableComponent<EspeceWithCounts, EspecesDataSource> {

  public displayedColumns: (EspecesOrderBy | "actions")[] = [
    "nomClasse",
    "code",
    "nomFrancais",
    "nomLatin",
    "nbDonnees",
    "actions"
  ];

  constructor(private especesGetService: EspecesGetService) {
    super();
  }

  getNewDataSource(): EspecesDataSource {
    return new EspecesDataSource(this.especesGetService);
  }

  loadEntities = (): void => {
    this.dataSource.loadEspeces(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active as EspecesOrderBy,
      this.sort.direction,
      this.filterComponent?.input.nativeElement.value
    );
  }

}
