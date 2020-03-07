import { Injectable } from "@angular/core";
import { AbstractControl, Validators } from "@angular/forms";
import {
  CoordinatesSystem,
  CoordinatesSystemType,
  COORDINATES_SYSTEMS_CONFIG
} from "ouca-common/coordinates-system";
import { BehaviorSubject, Observable } from "rxjs";
import { BackendApiService } from "../modules/shared/services/backend-api.service";

@Injectable({
  providedIn: "root"
})
export class CoordinatesService {
  private appCoordinatesSystem$: BehaviorSubject<
    CoordinatesSystemType
  > = new BehaviorSubject<CoordinatesSystemType>(null);

  constructor(private backendApiService: BackendApiService) {}

  public getAppCoordinatesSystem = (): CoordinatesSystemType => {
    return this.appCoordinatesSystem$.value;
  };

  public getAppCoordinatesSystem$ = (): Observable<CoordinatesSystemType> => {
    return this.appCoordinatesSystem$;
  };

  public initAppCoordinatesSystem = (): void => {
    this.backendApiService.getAppCoordinatesSystem$().subscribe((system) => {
      this.appCoordinatesSystem$.next(system);
    });
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
