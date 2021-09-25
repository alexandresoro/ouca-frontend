import { ChangeDetectionStrategy, Component } from "@angular/core";
import { EntitesAvecLibelleOrderBy, ObservateurWithCounts } from "src/app/model/graphql";
import { ObservateursPaginatedService } from "src/app/services/observateurs-paginated.service";
import { EntiteAvecLibelleTableComponent } from "../entite-avec-libelle-table/entite-avec-libelle-table.component";
import { ObservateursDataSource } from "./ObservateursDataSource";

@Component({
  selector: "observateur-table",
  styleUrls: [
    "../entite-avec-libelle-table/entite-avec-libelle-table.component.scss"
  ],
  templateUrl:
    "../entite-avec-libelle-table/entite-avec-libelle-table.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObservateurTableComponent extends EntiteAvecLibelleTableComponent<ObservateurWithCounts, ObservateursDataSource> {
  constructor(private observateursPaginatedService: ObservateursPaginatedService) {
    super();
  }

  getNewDataSource(): ObservateursDataSource {
    return new ObservateursDataSource(this.observateursPaginatedService);
  }

  loadEntities = (): void => {
    this.dataSource.loadObservateurs(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active as EntitesAvecLibelleOrderBy,
      this.sort.direction,
      this.filterComponent?.input.nativeElement.value
    );
  }
}
