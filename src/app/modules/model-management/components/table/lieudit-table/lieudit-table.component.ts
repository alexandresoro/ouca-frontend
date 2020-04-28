import { ChangeDetectionStrategy, Component, OnDestroy } from "@angular/core";
import * as _ from "lodash";
import {
  CoordinatesSystemType,
  COORDINATES_SYSTEMS_CONFIG,
  getCoordinates
} from "ouca-common/coordinates-system";
import { Coordinates } from "ouca-common/coordinates.object";
import { combineLatest, Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { UILieudit } from "src/app/models/lieudit.model";
import { AppConfigurationService } from "src/app/services/app-configuration.service";
import { EntitiesStoreService } from "src/app/services/entities-store.service";
import { EntiteSimpleTableComponent } from "../entite-simple-table/entite-simple-table.component";

interface LieuditRow {
  id: number;
  departement: string;
  codeCommune: number;
  nomCommune: string;
  nom: string;
  altitude: number;
  longitude: number;
  latitude: number;
  coordinatesSystem: string;
  areTransformed: boolean;
  nbDonnees: number;
}

@Component({
  selector: "lieudit-table",
  styleUrls: ["./lieudit-table.component.scss"],
  templateUrl: "./lieudit-table.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LieuditTableComponent extends EntiteSimpleTableComponent<UILieudit>
  implements OnDestroy {
  private readonly destroy$ = new Subject();

  public displayedColumns: string[] = [
    "departement",
    "codeCommune",
    "nomCommune",
    "nom",
    "altitude",
    "longitude",
    "latitude",
    "coordinatesSystem",
    "nbDonnees"
  ];

  constructor(
    private appConfigurationService: AppConfigurationService,
    private entitiesStoreService: EntitiesStoreService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initialize();

    combineLatest(
      this.getEntities$(),
      this.appConfigurationService.getAppCoordinatesSystemType$(),
      (lieuxdits, coordinatesSystemType) => {
        return this.buildLieuxditsRows(lieuxdits, coordinatesSystemType);
      }
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe((lieuxditsRows) => {
        this.dataSource.data = lieuxditsRows;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public getEntities$ = (): Observable<UILieudit[]> => {
    return this.entitiesStoreService.getLieuxdits$();
  };

  public getDataSource(): [] {
    return [];
  }

  private buildLieuxditsRows = (
    lieuxdits: UILieudit[],
    coordinatesSystemType: CoordinatesSystemType
  ): LieuditRow[] => {
    const rows: LieuditRow[] = [];
    _.forEach(lieuxdits, (lieudit) => {
      rows.push(this.buildRowFromLieudit(lieudit, coordinatesSystemType));
    });
    return rows;
  };

  private buildRowFromLieudit(
    lieudit: UILieudit,
    coordinatesSystemType: CoordinatesSystemType
  ): LieuditRow {
    const coordinates: Coordinates = getCoordinates(
      lieudit,
      coordinatesSystemType
    );

    return {
      id: lieudit.id,
      departement: lieudit.commune.departement.code,
      codeCommune: lieudit.commune.code,
      nomCommune: lieudit.commune.nom,
      nom: lieudit.nom,
      altitude: lieudit.altitude,
      longitude: coordinates.longitude,
      latitude: coordinates.latitude,
      coordinatesSystem: COORDINATES_SYSTEMS_CONFIG[coordinates.system].name,
      areTransformed: !!coordinates.areTransformed,
      nbDonnees: lieudit.nbDonnees
    };
  }
}
