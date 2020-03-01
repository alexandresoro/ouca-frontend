import { Component, OnChanges, SimpleChanges } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import * as _ from "lodash";
import {
  COORDINATES_SYSTEMS_CONFIG,
  getCoordinates
} from "ouca-common/coordinates-system";
import { Coordinates } from "ouca-common/coordinates.object";
import { Lieudit } from "ouca-common/lieudit.object";
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

  constructor(private coordinatesService: CoordinatesService) {
    super();
    this.coordinatesService.initAppCoordinatesSystem();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.objects && !!changes.objects.currentValue) {
      const rows: LieuditRow[] = [];
      _.forEach(changes.objects.currentValue, (value: Lieudit) => {
        rows.push(this.buildRowFromLieudit(value));
      });
      this.dataSource = new MatTableDataSource(rows);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  private buildRowFromLieudit(lieudit: Lieudit): LieuditRow {
    const coordinates: Coordinates = getCoordinates(
      lieudit,
      this.coordinatesService.getAppCoordinatesSystem()
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
