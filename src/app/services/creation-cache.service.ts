import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { DonneeFormObject } from "../modules/donnee-creation/models/donnee-form-object.model";
import { DonneeInCache } from "../modules/donnee-creation/models/donnee-in-cache.model";

@Injectable({
  providedIn: "root",
})
export class CreationCacheService {
  private donnee$: BehaviorSubject<DonneeInCache> = new BehaviorSubject<
    DonneeInCache
  >(null);

  public saveCurrentContext = (
    donnee: DonneeFormObject,
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
      isDonneeEnabled,
    });
  };

  public getSavedContext = (): DonneeInCache => {
    return this.donnee$.value;
  };
}
