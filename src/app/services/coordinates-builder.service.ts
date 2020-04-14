import { Injectable } from "@angular/core";
import { AbstractControl, Validators } from "@angular/forms";
import {
  CoordinatesSystem,
  CoordinatesSystemType,
  COORDINATES_SYSTEMS_CONFIG,
} from "ouca-common/coordinates-system";
import { Coordinates } from "ouca-common/coordinates.object";
import { AppConfigurationService } from "./app-configuration.service";

@Injectable({
  providedIn: "root",
})
export class CoordinatesBuilderService {
  constructor(private appConfigurationService: AppConfigurationService) {}

  public buildCoordinates = (
    longitude: number,
    latitude: number
  ): Partial<Record<CoordinatesSystemType, Coordinates>> => {
    const system: CoordinatesSystemType = this.appConfigurationService.getAppCoordinatesSystemType();
    const coordinates: Partial<Record<CoordinatesSystemType, Coordinates>> = {};
    coordinates[system] = {
      longitude: longitude,
      latitude: latitude,
      system,
      isTransformed: false,
    };
    return coordinates;
  };

  public updateCoordinatesValidators = (
    coordinatesSystemType: CoordinatesSystemType,
    longitudeControl: AbstractControl,
    latitudeControl: AbstractControl
  ): void => {
    const coordinatesSystem: CoordinatesSystem =
      COORDINATES_SYSTEMS_CONFIG[coordinatesSystemType];

    longitudeControl.setValidators([
      Validators.required,
      Validators.min(coordinatesSystem?.longitudeRange.min),
      Validators.max(coordinatesSystem?.longitudeRange.max),
    ]);
    latitudeControl.setValidators([
      Validators.required,
      Validators.min(coordinatesSystem?.latitudeRange.min),
      Validators.max(coordinatesSystem?.latitudeRange.max),
    ]);

    longitudeControl.updateValueAndValidity();
    latitudeControl.updateValueAndValidity();
  };
}
