import { Injectable } from "@angular/core";
import {
  CoordinatesSystem,
  CoordinatesSystemType,
  COORDINATES_SYSTEMS_CONFIG
} from "@ou-ca/ouca-model/coordinates-system";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class CoordinatesService {
  private coordinatesSystem$: BehaviorSubject<
    CoordinatesSystem
  > = new BehaviorSubject(null);

  private areCoordinatesTransformed$: BehaviorSubject<
    boolean
  > = new BehaviorSubject(false);

  private areCoordinatesInvalid$: BehaviorSubject<
    boolean
  > = new BehaviorSubject(false);

  public getCoordinatesSystem$ = (): Observable<CoordinatesSystem> => {
    return this.coordinatesSystem$;
  };

  public getCoordinatesSystem = (): CoordinatesSystem => {
    return this.coordinatesSystem$.value;
  };

  public getCoordinatesSystemType = (): CoordinatesSystemType => {
    return this.coordinatesSystem$.value.code;
  };

  public setCoordinatesSystemType = (
    coordinatesSystemType: CoordinatesSystemType
  ): void => {
    const system = COORDINATES_SYSTEMS_CONFIG[coordinatesSystemType];
    this.coordinatesSystem$.next(system ?? null);
  };

  public getAreCoordinatesTransformed$ = (): Observable<boolean> => {
    return this.areCoordinatesTransformed$;
  };

  public setAreCoordinatesTransformed = (areTransformed: boolean): void => {
    this.areCoordinatesTransformed$.next(areTransformed);
  };

  public getAreCoordinatesInvalid$ = (): Observable<boolean> => {
    return this.areCoordinatesInvalid$;
  };

  public setAreCoordinatesInvalid = (areInvalid: boolean): void => {
    this.areCoordinatesInvalid$.next(areInvalid);
  };
}
