import { Component, OnChanges, SimpleChanges } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import * as _ from "lodash";
import {
  CoordinatesSystemType,
  COORDINATES_SYSTEMS_CONFIG,
  getCoordinates
} from "ouca-common/coordinates-system";
import { Coordinates } from "ouca-common/coordinates.object";
import { Lieudit } from "ouca-common/lieudit.object";
import { combineLatest, Subject } from "rxjs";
import { CoordinatesService } from "../../../../../services/coordinates.service";
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
  isTransformed: boolean;
  nbDonnees: number;
}

@Component({
  selector: "lieudit-table",
  styleUrls: ["./lieudit-table.component.scss"],
  templateUrl: "./lieudit-table.component.html"
})
export class LieuditTableComponent extends EntiteSimpleTableComponent<Lieudit>
  implements OnChanges {
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

  private lieuxdits$: Subject<Lieudit[]> = new Subject<Lieudit[]>();

  constructor(private coordinatesService: CoordinatesService) {
    super();
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    combineLatest(
      this.lieuxdits$,
      this.coordinatesService.getAppCoordinatesSystem$(),
      (lieuxdits, coordinatesSystemType) => {
        return this.buildLieuxditsRows(lieuxdits, coordinatesSystemType);
      }
    ).subscribe((lieuxditsRows) => {
      this.dataSource.data = lieuxditsRows;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.objects && !!changes.objects.currentValue) {
      this.lieuxdits$.next(changes.objects.currentValue);
    }
  }

  private buildLieuxditsRows = (
    lieuxdits: Lieudit[],
    coordinatesSystemType?: CoordinatesSystemType
  ): LieuditRow[] => {
    const rows: LieuditRow[] = [];
    _.forEach(lieuxdits, (lieudit: Lieudit) => {
      rows.push(this.buildRowFromLieudit(lieudit, coordinatesSystemType));
    });
    return rows;
  };

  private buildRowFromLieudit(
    lieudit: Lieudit,
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
      isTransformed: coordinates.isTransformed,
      nbDonnees: lieudit.nbDonnees
    };
  }

  public onRowLieuditClicked(id: number): void {
    if (!!this.selectedObject && this.selectedObject.id === id) {
      this.selectedObject = undefined;
    } else {
      this.selectedObject = this.objects.filter(
        (lieudit) => lieudit.id === id
      )[0];
    }
  }
}
