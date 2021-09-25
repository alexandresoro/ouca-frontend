import { ChangeDetectionStrategy, Component } from "@angular/core";
import { EntitesAvecLibelleOrderBy, MeteoWithCounts } from "src/app/model/graphql";
import { MeteosGetService } from "src/app/services/meteos-get.service";
import { EntiteAvecLibelleTableComponent } from "../entite-avec-libelle-table/entite-avec-libelle-table.component";
import { MeteosDataSource } from "./MeteosDataSource";

@Component({
  selector: "meteo-table",
  styleUrls: [
    "../entite-avec-libelle-table/entite-avec-libelle-table.component.scss"
  ],
  templateUrl:
    "../entite-avec-libelle-table/entite-avec-libelle-table.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeteoTableComponent extends EntiteAvecLibelleTableComponent<MeteoWithCounts, MeteosDataSource> {
  constructor(private meteosGetService: MeteosGetService) {
    super();
  }

  getNewDataSource(): MeteosDataSource {
    return new MeteosDataSource(this.meteosGetService);
  }

  loadEntities = (): void => {
    this.dataSource.loadMeteos(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active as EntitesAvecLibelleOrderBy,
      this.sort.direction,
      this.filterComponent?.input.nativeElement.value
    );
  }
}
