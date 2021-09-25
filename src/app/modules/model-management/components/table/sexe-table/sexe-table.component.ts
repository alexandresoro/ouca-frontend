import { ChangeDetectionStrategy, Component } from "@angular/core";
import { EntitesAvecLibelleOrderBy, SexeWithCounts } from "src/app/model/graphql";
import { SexesGetService } from "src/app/services/sexes-get.service";
import { EntiteAvecLibelleTableComponent } from "../entite-avec-libelle-table/entite-avec-libelle-table.component";
import { SexesDataSource } from "./SexesDataSource";

@Component({
  selector: "sexe-table",
  styleUrls: [
    "../entite-avec-libelle-table/entite-avec-libelle-table.component.scss"
  ],
  templateUrl:
    "../entite-avec-libelle-table/entite-avec-libelle-table.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SexeTableComponent extends EntiteAvecLibelleTableComponent<SexeWithCounts, SexesDataSource> {
  constructor(private sexesGetService: SexesGetService) {
    super();
  }

  getNewDataSource(): SexesDataSource {
    return new SexesDataSource(this.sexesGetService);
  }

  loadEntities = (): void => {
    this.dataSource.loadSexes(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active as EntitesAvecLibelleOrderBy,
      this.sort.direction,
      this.filterComponent?.input.nativeElement.value
    );
  }
}