import { Injectable } from "@angular/core";
import { Apollo, gql } from "apollo-angular";
import { BehaviorSubject, Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { Donnee, DonneeResult, QueryDonneeArgs } from "../model/graphql";
import { PostResponse } from '../model/types/post-response.object';
import { DonneeCachedObject } from "../modules/donnee-creation/models/cached-object";
import { has } from "../modules/shared/helpers/utils";
import { BackendApiService } from "./backend-api.service";
import { FetchLastDonneeIdService } from "./fetch-last-donnee-id.service";
import { StatusMessageService } from "./status-message.service";

type DonneeQueryResult = {
  donnee: DonneeResult
}

const DONNEE_QUERY = gql`
  query DonneeQuery($id: Int!) {
    donnee(id: $id) {
      id
      donnee {
        id
        inventaire {
          id
          observateur {
            id
            libelle
          }
          associes {
            id
            libelle
          }
          date
          heure
          duree
          lieuDit {
            id
            nom
            altitude
            longitude
            latitude
            coordinatesSystem
            commune {
              id
              code
              nom
              departement {
                id
                code
              }
            }
          }
          customizedCoordinates {
            altitude
            longitude
            latitude
            system
          }
          temperature
          meteos {
            id
            libelle
          }
        }
        espece {
          id
          code
          nomFrancais
          nomLatin
          classe {
            id
            libelle
          }
        }
        estimationNombre {
          id
          libelle
          nonCompte
        }
        nombre
        estimationDistance {
          id
          libelle
        }
        distance
        regroupement
        sexe {
          id
          libelle
        }
        age {
          id
          libelle
        }
        comportements {
          id
          code
          libelle
          nicheur
        }
        milieux {
          id
          code
          libelle
        }
        commentaire
      }
      navigation {
        previousDonneeId
        nextDonneeId
        index
      }
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class DonneeService {
  private currentDonnee$: BehaviorSubject<
    Donnee | DonneeCachedObject
  > = new BehaviorSubject<Donnee | DonneeCachedObject>(null);

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
    private apollo: Apollo,
    private fetchLastDonneeIdService: FetchLastDonneeIdService,
    private backendApiService: BackendApiService,
    private statusMessageService: StatusMessageService
  ) { }

  public getCurrentDonnee$ = (): Observable<Donnee | DonneeCachedObject> => {
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
    return has(this.currentDonnee$.value, 'id');
  };

  public isCurrentDonneeAnExistingOne$ = (): Observable<boolean> => {
    return this.currentDonnee$.pipe(map((donnee) => has(donnee, 'id')));
  };

  public getIsDonneeCallOngoing$ = (): Observable<boolean> => {
    return this.isDonneeCallOngoing$.asObservable();
  };

  public getDonneeById = (donneeId: number): Observable<boolean> => {
    this.isDonneeCallOngoing$.next(true);

    return this.apollo.query<DonneeQueryResult, QueryDonneeArgs>({
      query: DONNEE_QUERY,
      variables: {
        id: donneeId
      },
      fetchPolicy: 'network-only'
    }).pipe(
      map(({ data }) => data?.donnee),
      tap((donneeResult) => {
        this.isDonneeCallOngoing$.next(false);
        if (donneeResult?.donnee?.id) {
          this.currentDonnee$.next(donneeResult?.donnee);
          this.currentDonneeIndex$.next(donneeResult?.navigation?.index);
          this.previousDonneeId$.next(donneeResult?.navigation?.previousDonneeId);
          this.nextDonneeId$.next(donneeResult?.navigation?.nextDonneeId);
        } else {
          this.statusMessageService.showErrorMessage(`Aucune fiche espèce trouvée avec l'ID ${donneeId}.`);
        }
      }),
      map((donneeResult) => !!donneeResult?.donnee?.id)
    )
  };

  public getPreviousDonnee = (): Observable<boolean> => {
    return this.getDonneeById(this.previousDonneeId$.value);
  };

  public getNextDonnee = (): Observable<boolean> => {
    return this.getDonneeById(this.nextDonneeId$.value);
  };

  public setCurrentlyEditingDonnee = (
    donnee: DonneeCachedObject
  ): void => {
    this.isDonneeCallOngoing$.next(true);
    this.fetchLastDonneeIdService.fetch({}, {
      fetchPolicy: 'network-only'
    }).subscribe(({ data }) => {
      if (!data?.lastDonneeId) {
        return;
      }
      this.currentDonnee$.next(donnee);
      this.currentDonneeIndex$.next(null);

      this.previousDonneeId$.next(data.lastDonneeId);
      this.nextDonneeId$.next(null);

      this.isDonneeCallOngoing$.next(false);
    });
  };

  public initialize = (): Observable<number> => {
    return this.fetchLastDonneeIdService.fetch().pipe(
      map(({ data }) => data?.lastDonneeId),
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
    const currentDonnee = this.currentDonnee$.value as Donnee;
    return this.backendApiService
      .deleteDonnee(currentDonnee?.id, currentDonnee?.inventaire?.id)
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
        return (donnee as Donnee)?.id;
      })
    );
  };
}
