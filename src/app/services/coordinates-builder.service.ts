import { Injectable } from "@angular/core";
import { CoordinatesSystemType } from "ouca-common/coordinates-system";
import { Coordinates } from "ouca-common/coordinates.object";
import { CoordinatesService } from "./coordinates.service";

@Injectable({
  providedIn: "root"
})
export class CoordinatesBuilderService {
  constructor(private coordinatesService: CoordinatesService) {}

  public buildCoordinates = (
    longitude: number,
    latitude: number
  ): Partial<Record<CoordinatesSystemType, Coordinates>> => {
    const system: CoordinatesSystemType = this.coordinatesService.getAppCoordinatesSystem();
    const coordinates: Partial<Record<CoordinatesSystemType, Coordinates>> = {};
    coordinates[system] = {
      longitude: longitude,
      latitude: latitude,
      system,
      isTransformed: false
    };
    return coordinates;
  };
}
