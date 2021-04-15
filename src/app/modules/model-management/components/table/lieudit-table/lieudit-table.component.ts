import { ChangeDetectionStrategy, Component, OnDestroy } from "@angular/core";
import { combineLatest, Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { getCoordinates } from 'src/app/model/coordinates-system/coordinates-helper';
import { CoordinatesSystemType } from 'src/app/model/coordinates-system/coordinates-system.object';
import { Coordinates } from 'src/app/model/types/coordinates.object';
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
  longitude: number | string;
  latitude: number | string;
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
    "latitude",
    "longitude",
    "altitude",
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
    lieuxdits?.forEach((lieudit) => {
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
      longitude: coordinates.areInvalid
        ? "Non supporté"
        : coordinates.longitude,
      latitude: coordinates.areInvalid ? "Non supporté" : coordinates.latitude,
      nbDonnees: lieudit.nbDonnees
    };
  }
}
