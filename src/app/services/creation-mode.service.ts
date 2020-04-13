import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
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
          isDonneeEnabled,
        };
      })
    );
  };

  public getIsInventaireEnabled$ = (): Observable<boolean> => {
    return this.isInventaireEnabled$;
  };

  public getIsDonneeEnabled$ = (): Observable<boolean> => {
    return this.isDonneeEnabled$;
  };

  public setStatus = (
    isInventaireEnabled: boolean,
    isDonneeEnabled: boolean
  ): void => {
    this.isInventaireEnabled$.next(isInventaireEnabled);
    this.isDonneeEnabled$.next(isDonneeEnabled);
  };

  public getIsInventaireEnabled = (): boolean => {
    return this.isInventaireEnabled$.value;
  };

  public getIsDonneeEnabled = (): boolean => {
    return this.isDonneeEnabled$.value;
  };

  public isDonneeOnlyEnabled$ = (): Observable<boolean> => {
    return this.getStatus$().pipe(
      map((status) => !status.isInventaireEnabled && status.isDonneeEnabled)
    );
  };

  public isInventaireOnlyEnabled$ = (): Observable<boolean> => {
    return this.getStatus$().pipe(
      map((status) => status.isInventaireEnabled && !status.isDonneeEnabled)
    );
  };
}
