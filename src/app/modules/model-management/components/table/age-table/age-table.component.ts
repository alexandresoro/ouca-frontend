import { ChangeDetectionStrategy, Component } from "@angular/core";
import { AgeWithCounts, EntitesAvecLibelleOrderBy } from "src/app/model/graphql";
import { AgesPaginatedService } from "src/app/services/ages-paginated.service";
import { EntiteAvecLibelleTableComponent } from "../entite-avec-libelle-table/entite-avec-libelle-table.component";
import { AgesDataSource } from "./AgesDataSource";

@Component({
  selector: "age-table",
  styleUrls: [
    "../entite-avec-libelle-table/entite-avec-libelle-table.component.scss"
  ],
  templateUrl:
    "../entite-avec-libelle-table/entite-avec-libelle-table.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgeTableComponent extends EntiteAvecLibelleTableComponent<AgeWithCounts, AgesDataSource> {

  constructor(private agesPaginatedService: AgesPaginatedService) {
    super();
  }

  getNewDataSource(): AgesDataSource {
    return new AgesDataSource(this.agesPaginatedService);
  }

  loadEntities = (): void => {
    this.dataSource.loadAges(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active as EntitesAvecLibelleOrderBy,
      this.sort.direction,
      this.filterComponent?.input.nativeElement.value
    );
  }
}
