import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class CreationModeService {
  private isInventaireEnabled$: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );
  private isDonneeEnabled$: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );

  public getStatus$ = (): Observable<{
    isInventaireEnabled: boolean;
    isDonneeEnabled: boolean;
  }> => {
    return combineLatest(this.isInventaireEnabled$, this.isDonneeEnabled$).pipe(
      map(([isInventaireEnabled, isDonneeEnabled]) => {
        return {
          isInventaireEnabled,
          isDonneeEnabled
        };
      })
    );
  };

  public getIsInventaireEnabled$ = (): Observable<boolean> => {
    return this.isInventaireEnabled$.asObservable();
  };

  public getIsDonneeEnabled$ = (): Observable<boolean> => {
    return this.isDonneeEnabled$.asObservable();
  };

  public setInventaireEnabled = (isInventaireEnabled: boolean): void => {
    this.isInventaireEnabled$.next(isInventaireEnabled);
  };

  public setDonneeEnabled = (isDonneeEnabled: boolean): void => {
    this.isDonneeEnabled$.next(isDonneeEnabled);
  };

  public setStatus = (
    isInventaireEnabled: boolean,
    isDonneeEnabled: boolean
  ): void => {
    this.isInventaireEnabled$.next(isInventaireEnabled);
    this.isDonneeEnabled$.next(isDonneeEnabled);
  };
}
