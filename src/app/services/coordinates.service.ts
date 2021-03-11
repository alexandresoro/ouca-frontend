import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { COORDINATES_SYSTEMS_CONFIG } from '../model/coordinates-system/coordinates-system-list.object';
import { CoordinatesSystem, CoordinatesSystemType } from '../model/coordinates-system/coordinates-system.object';

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
