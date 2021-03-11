import { Injectable } from "@angular/core";
import { AbstractControl, Validators } from "@angular/forms";
import { COORDINATES_SYSTEMS_CONFIG } from '../model/coordinates-system/coordinates-system-list.object';
import { CoordinatesSystem, CoordinatesSystemType } from '../model/coordinates-system/coordinates-system.object';

@Injectable({
  providedIn: "root"
})
export class CoordinatesBuilderService {
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
      Validators.max(coordinatesSystem?.longitudeRange.max)
    ]);
    latitudeControl.setValidators([
      Validators.required,
      Validators.min(coordinatesSystem?.latitudeRange.min),
      Validators.max(coordinatesSystem?.latitudeRange.max)
    ]);

    longitudeControl.updateValueAndValidity();
    latitudeControl.updateValueAndValidity();
  };
}
