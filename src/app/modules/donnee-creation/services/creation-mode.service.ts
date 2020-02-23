import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { CreationModeEnum } from "../helpers/creation-mode.enum";

@Injectable({
  providedIn: "root"
})
export class CreationModeService {
  private mode$: BehaviorSubject<CreationModeEnum> = new BehaviorSubject(null);

  public updateCreationMode = (mode: CreationModeEnum): void => {
    this.mode$.next(mode);
  };

  public getCreationMode = (): CreationModeEnum => {
    return this.mode$.value;
  };

  public isInventaireMode$ = (): Observable<boolean> => {
    return this.mode$.pipe(
      map(mode => {
        return CreationModeEnum.NEW_INVENTAIRE === mode;
      })
    );
  };

  public isInventaireMode = (): boolean => {
    return CreationModeEnum.NEW_INVENTAIRE === this.mode$.value;
  };

  public isDonneeMode$ = (): Observable<boolean> => {
    return this.mode$.pipe(
      map(mode => {
        return CreationModeEnum.NEW_DONNEE === mode;
      })
    );
  };

  public isDonneeMode = (): boolean => {
    return CreationModeEnum.NEW_DONNEE === this.mode$.value;
  };

  public isUpdateMode$ = (): Observable<boolean> => {
    return this.mode$.pipe(
      map(mode => {
        return CreationModeEnum.UPDATE === mode;
      })
    );
  };

  public isUpdateMode = (): boolean => {
    return CreationModeEnum.UPDATE === this.mode$.value;
  };
}
