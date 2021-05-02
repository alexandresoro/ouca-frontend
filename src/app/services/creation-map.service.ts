import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, ReplaySubject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

@Injectable({
  providedIn: "root"
})
export class CreationMapService {

  // The id of the currently selected lieu dit, selected via the map or via the input
  private selectedLieuDitId$ = new BehaviorSubject<number>(null);

  // The id of the lieu dit that is expected to be focused
  private lieuDitIdFocused$ = new ReplaySubject<number>(1);

  // The cooredinates and possible zoom requested as location to be zoomed to from outside the map
  private coordinatesToFocus$ = new ReplaySubject<[number, number][]>(1);

  // The information related to the current status of the custom marker
  private disabledCustomMarkerInformation: { isActive: boolean, linkedLieuDitId: number } = { isActive: false, linkedLieuDitId: null };
  private customMarkerInformation$ = new BehaviorSubject<{ isActive: boolean, linkedLieuDitId?: number }>(this.disabledCustomMarkerInformation);

  private customMarkerPosition$ = new ReplaySubject<{ coordinates: L.LatLng, isSetByMap: boolean }>(1);

  private lieuDitControlChangeEvent$ = new ReplaySubject<void>(1);

  public getSelectedLieuDitId$ = (): Observable<number> => {
    return this.selectedLieuDitId$.asObservable();
  }

  public setSelectedLieuDitId = (lieuDitId: number, isFromControl = false): void => {
    // Disable the custom marker info
    if (lieuDitId) {
      this.setCustomMarkerInformation(this.disabledCustomMarkerInformation);
      this.setCustomMarkerPosition(null, !isFromControl);
    }

    // Set the given lieu dit as selected
    this.selectedLieuDitId$.next(lieuDitId);
    if (isFromControl) {
      this.lieuDitControlChangeEvent$.next();
    }
  }

  public getFocusedLieuDitId$ = (): Observable<number> => {
    return this.lieuDitIdFocused$.asObservable();
  }

  public setFocusedLieuDitId = (lieuDitId: number): void => {
    this.lieuDitIdFocused$.next(lieuDitId);
  }

  public getCoordinatesToFocus$ = (): Observable<[number, number][]> => {
    return this.coordinatesToFocus$.asObservable();
  }

  public setCoordinatesToFocus = (coordinates: [number, number][]): void => {
    this.coordinatesToFocus$.next(coordinates);
  }

  public resetCustomControl = (): void => {
    this.selectedLieuDitId$.next(this.customMarkerInformation$.getValue().linkedLieuDitId);
    this.setCustomMarkerInformation(this.disabledCustomMarkerInformation);
    this.setCustomMarkerPosition(null, true);
  }

  public getCustomMarkerInformation$ = (): Observable<{ isActive: boolean, linkedLieuDitId?: number }> => {
    return this.customMarkerInformation$.asObservable();
  }

  public setCustomMarkerInformation = (customMarkerInformation: { isActive: boolean, linkedLieuDitId?: number }, isFromControl = false): void => {

    if (customMarkerInformation?.isActive) {
      // When we select a custom marker, we deactivate the selected lieu dit (which can still be the linked lieu dit)
      this.setSelectedLieuDitId(null, isFromControl);
    }

    this.customMarkerInformation$.next(customMarkerInformation);
    if (isFromControl) {
      this.lieuDitControlChangeEvent$.next();
    }
  }

  // Returns the lieu dit id that should be used for display, either because it is directly selected, or because there is a custom marker attached to it
  public getLieuDitIdForControl$ = (): Observable<number> => {
    return combineLatest(
      [this.selectedLieuDitId$, this.customMarkerInformation$]
    ).pipe(
      distinctUntilChanged(([selA, cusA], [selB, cusB]) => { return (selA === selB) && (cusA?.linkedLieuDitId === cusB.linkedLieuDitId) }),
      map(([selectedLieuDit, customMarkerInformation]) => {
        return selectedLieuDit ?? customMarkerInformation?.linkedLieuDitId;
      })
    );
  }

  public getCustomMarkerPosition$ = (): Observable<{ coordinates: L.LatLng, isSetByMap: boolean }> => {
    return this.customMarkerPosition$.asObservable();
  }

  public setCustomMarkerPosition = (coordinates: L.LatLng, isSetByMap = false): void => {
    this.customMarkerPosition$.next({ coordinates, isSetByMap });
  }

  public getLieuDitControlChangeEvent$ = (): Observable<void> => {
    return this.lieuDitControlChangeEvent$.asObservable();
  }

}