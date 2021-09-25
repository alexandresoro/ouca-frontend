import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ComportementsOrderBy, ComportementWithCounts, Nicheur } from "src/app/model/graphql";
import { NICHEUR_VALUES } from "src/app/model/types/nicheur.model";
import { ComportementsGetService } from "src/app/services/comportements-get.service";
import { EntiteTableComponent } from "../entite-table/entite-table.component";
import { ComportementsDataSource } from "./ComportementsDataSource";

@Component({
  selector: "comportement-table",
  styleUrls: ["./comportement-table.component.scss"],
  templateUrl: "./comportement-table.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComportementTableComponent extends EntiteTableComponent<ComportementWithCounts, ComportementsDataSource> {
  public displayedColumns: (string)[] = [
    "code",
    "libelle",
    "nicheur",
    "nbDonnees",
    "actions"
  ];

  constructor(private comportementsGetService: ComportementsGetService) {
    super();
  }

  getNewDataSource(): ComportementsDataSource {
    return new ComportementsDataSource(this.comportementsGetService);
  }

  loadEntities = (): void => {
    this.dataSource.loadComportements(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active as ComportementsOrderBy,
      this.sort.direction,
      this.filterComponent?.input.nativeElement.value
    );
  }

  public getNicheur = (code: Nicheur): string => {
    return !code ? "" : NICHEUR_VALUES[code].name;
  };

}
