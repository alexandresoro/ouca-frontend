import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { Donnee } from '../model/types/donnee.object';
import { PostResponse } from '../model/types/post-response.object';
import { DonneeFormObject } from "../modules/donnee-creation/models/donnee-form-object.model";
import { BackendApiService } from "./backend-api.service";
import { StatusMessageService } from "./status-message.service";

@Injectable({
  providedIn: "root"
})
export class DonneeService {
  private currentDonnee$: BehaviorSubject<
    Donnee | DonneeFormObject
  > = new BehaviorSubject<Donnee | DonneeFormObject>(null);

  private currentDonneeIndex$: BehaviorSubject<number> = new BehaviorSubject<
    number
  >(null);

  private previousDonneeId$: BehaviorSubject<number> = new BehaviorSubject<
    number
  >(null);

  private nextDonneeId$: BehaviorSubject<number> = new BehaviorSubject<number>(
    null
  );

  private isDonneeCallOngoing$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  constructor(
    private backendApiService: BackendApiService,
    private statusMessageService: StatusMessageService
  ) { }

  public getCurrentDonnee$ = (): Observable<Donnee | DonneeFormObject> => {
    return this.currentDonnee$.asObservable();
  };

  public getCurrentDonneeIndex$ = (): Observable<number> => {
    return this.currentDonneeIndex$.asObservable();
  };

  public hasPreviousDonnee$ = (): Observable<boolean> => {
    return this.previousDonneeId$.pipe(map((id) => !!id));
  };

  public hasNextDonnee$ = (): Observable<boolean> => {
    return this.nextDonneeId$.pipe(map((id) => !!id));
  };

  public hasNextDonnee = (): boolean => {
    return !!this.nextDonneeId$.value;
  };

  public isCurrentDonneeAnExistingOne = (): boolean => {
    return !!this.currentDonnee$.value?.id;
  };

  public isCurrentDonneeAnExistingOne$ = (): Observable<boolean> => {
    return this.currentDonnee$.pipe(map((donnee) => !!donnee?.id));
  };

  public getIsDonneeCallOngoing$ = (): Observable<boolean> => {
    return this.isDonneeCallOngoing$.asObservable();
  };

  public getDonneeById = (donneeId: number): Observable<boolean> => {
    this.isDonneeCallOngoing$.next(true);

    return this.backendApiService.getDonneeByIdWithContext(donneeId).pipe(
      tap((donnee) => {
        this.isDonneeCallOngoing$.next(false);
        if (donnee?.id) {
          this.currentDonnee$.next(donnee);
          this.currentDonneeIndex$.next(donnee.indexDonnee);
          this.previousDonneeId$.next(donnee.previousDonneeId);
          this.nextDonneeId$.next(donnee.nextDonneeId);
        } else {
          this.statusMessageService.showErrorMessage(
            "Aucune fiche espèce trouvée avec l'ID " + donneeId + "."
          );
        }
      }),
      map((donnee) => !!donnee?.id)
    );
  };

  public getPreviousDonnee = (): Observable<boolean> => {
    return this.getDonneeById(this.previousDonneeId$.value);
  };

  public getNextDonnee = (): Observable<boolean> => {
    return this.getDonneeById(this.nextDonneeId$.value);
  };

  public setCurrentlyEditingDonnee = (
    donnee: Donnee | DonneeFormObject
  ): void => {
    this.isDonneeCallOngoing$.next(true);
    this.backendApiService.getLastDonneeId().subscribe((lastDonneeId) => {
      if (!lastDonneeId) {
        return;
      }
      this.currentDonnee$.next(donnee);
      this.currentDonneeIndex$.next(null);

      this.previousDonneeId$.next(lastDonneeId);
      this.nextDonneeId$.next(null);

      this.isDonneeCallOngoing$.next(false);
    });
  };

  public initialize = (): Observable<number> => {
    return this.backendApiService.getLastDonneeId().pipe(
      tap((id) => {
        this.previousDonneeId$.next(id);
        this.currentDonnee$.next(null);
        this.currentDonneeIndex$.next(null);
        this.nextDonneeId$.next(null);
      })
    );
  };

  public setPreviousDonneeId = (id: number): void => {
    this.previousDonneeId$.next(id);
  };

  public deleteCurrentDonnee = (): Observable<PostResponse> => {
    const currentDonnee = this.currentDonnee$.value;
    return this.backendApiService
      .deleteDonnee(currentDonnee?.id, currentDonnee?.inventaireId)
      .pipe(
        tap((response) => {
          if (response.isSuccess) {
            this.statusMessageService.showSuccessMessage(
              "La fiche espèce a été supprimée avec succès."
            );
          } else {
            this.statusMessageService.showErrorMessage(
              "Une erreur est survenue pendant la suppression de la fiche espèce.",
              response.message
            );
          }
        })
      );
  };

  public getDisplayedDonneeId$ = (): Observable<number> => {
    return this.currentDonnee$.pipe(
      map((donnee) => {
        return donnee?.id;
      })
    );
  };
}
