import { ChangeDetectionStrategy, Component } from "@angular/core";
import { takeUntil } from "rxjs/operators";
import { CoordinatesSystemType, LieuxDitsOrderBy } from "src/app/model/graphql";
import { AppConfigurationGetService } from "src/app/services/app-configuration-get.service";
import { LieuxDitsGetService } from "src/app/services/lieux-dits-get.service";
import { EntiteTableComponent } from "../entite-table/entite-table.component";
import { LieuDitRow, LieuxDitsDataSource } from "./LieuxDitsDataSource";

@Component({
  selector: "lieudit-table",
  styleUrls: ["./lieudit-table.component.scss"],
  templateUrl: "./lieudit-table.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LieuditTableComponent extends EntiteTableComponent<LieuDitRow, LieuxDitsDataSource> {

  public displayedColumns: string[] = [
    "departement",
    "codeCommune",
    "nomCommune",
    "nom",
    "latitude",
    "longitude",
    "altitude",
    "nbDonnees",
    "actions"
  ];

  private coordinatesSystem: CoordinatesSystemType;

  constructor(
    private appConfigurationGetService: AppConfigurationGetService,
    private lieuxDitsGetService: LieuxDitsGetService,
  ) {
    super();
    this.coordinatesSystem = null;
  }

  getNewDataSource(): LieuxDitsDataSource {
    return new LieuxDitsDataSource(this.lieuxDitsGetService);
  }

  protected customOnInit = (): void => {
    this.appConfigurationGetService.watch().valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ data }) => {
        this.coordinatesSystem = data?.settings?.coordinatesSystem;
        this.loadEntities();
      });
  }

  loadEntities = (): void => {
    this.dataSource.loadLieuxDits(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active as LieuxDitsOrderBy,
      this.sort.direction,
      this.filterComponent?.input.nativeElement.value,
      this.coordinatesSystem
    );
  }
}
