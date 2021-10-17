import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { DonneeCachedObject } from "../modules/donnee-creation/models/cached-object";
import { DonneeInCache } from "../modules/donnee-creation/models/donnee-in-cache.model";

@Injectable({
  providedIn: "root"
})
export class CreationCacheService {
  private donnee$: BehaviorSubject<DonneeInCache> = new BehaviorSubject<
    DonneeInCache
  >(null);

  public saveCurrentContext = (
    donnee: DonneeCachedObject,
    isInventaireEnabled: boolean,
    isDonneeEnabled: boolean
  ): void => {
    console.log(
      "Sauvegarde de la donnée en cours d'édition dans le cache",
      donnee
    );
    this.donnee$.next({
      donnee,
      isInventaireEnabled,
      isDonneeEnabled
    });
  };

  public deleteCurrentContext = (): void => {
    this.donnee$.next(null);
  };

  public getSavedContext = (): DonneeInCache => {
    return this.donnee$.value;
  };
}
