import { Injectable } from "@angular/core";
import { combineLatest, Observable, ReplaySubject } from "rxjs";
import { filter, map } from "rxjs/operators";
import { ComportementWithCounts } from "../model/graphql";
import { Age } from '../model/types/age.object';
import { Classe } from '../model/types/classe.object';
import { Comportement } from '../model/types/comportement.object';
import { Espece } from '../model/types/espece.model';
import { EstimationDistance } from '../model/types/estimation-distance.object';
import { EstimationNombre } from '../model/types/estimation-nombre.object';
import { Milieu } from '../model/types/milieu.object';
import { Sexe } from '../model/types/sexe.object';
import { UIEspece } from "../models/espece.model";
import { has } from '../modules/shared/helpers/utils';
import { BackendWsService } from "./backend-ws.service";

@Injectable({
  providedIn: "root"
})
export class EntitiesStoreService {

  private classes$: ReplaySubject<Classe[]> = new ReplaySubject<Classe[]>(1);

  private especesFlat$: ReplaySubject<Espece[]> = new ReplaySubject<Espece[]>(
    1
  );

  private especes$: Observable<UIEspece[]>;

  private sexes$: ReplaySubject<Sexe[]> = new ReplaySubject<Sexe[]>(1);

  private ages$: ReplaySubject<Age[]> = new ReplaySubject<Age[]>(1);

  private estimationNombres$: ReplaySubject<
    EstimationNombre[]
  > = new ReplaySubject<EstimationNombre[]>(1);

  private estimationDistances$: ReplaySubject<
    EstimationDistance[]
  > = new ReplaySubject<EstimationDistance[]>(1);

  private comportements$: ReplaySubject<ComportementWithCounts[]> = new ReplaySubject<
    ComportementWithCounts[]
  >(1);

  private milieux$: ReplaySubject<Milieu[]> = new ReplaySubject<Milieu[]>(1);

  private donneeEntities$: Observable<{
    classes: Classe[];
    especes: UIEspece[];
    ages: Age[];
    sexes: Sexe[];
    estimationsNombre: EstimationNombre[];
    estimationsDistance: EstimationDistance[];
    comportements: Comportement[];
    milieux: Milieu[];
  }>;

  constructor(
    private backendWsService: BackendWsService

  ) { }

  public initializeEntitiesStore = (): void => {

    this.backendWsService
      .getUpdateMessageContent$()
      .pipe(
        filter((updateContent) => has(updateContent, "classes")),
        map((updateContent) => {
          return updateContent.classes;
        })
      )
      .subscribe((classes) => {
        this.classes$.next(classes);
      });

    this.backendWsService
      .getUpdateMessageContent$()
      .pipe(
        filter((updateContent) => has(updateContent, "especes")),
        map((updateContent) => {
          return updateContent.especes;
        })
      )
      .subscribe((especes) => {
        this.especesFlat$.next(especes);
      });

    this.backendWsService
      .getUpdateMessageContent$()
      .pipe(
        filter((updateContent) => has(updateContent, "sexes")),
        map((updateContent) => {
          return updateContent.sexes;
        })
      )
      .subscribe((sexes) => {
        this.sexes$.next(sexes);
      });

    this.backendWsService
      .getUpdateMessageContent$()
      .pipe(
        filter((updateContent) => has(updateContent, "ages")),
        map((updateContent) => {
          return updateContent.ages;
        })
      )
      .subscribe((ages) => {
        this.ages$.next(ages);
      });

    this.backendWsService
      .getUpdateMessageContent$()
      .pipe(
        filter((updateContent) => has(updateContent, "estimationsDistance")),
        map((updateContent) => {
          return updateContent.estimationsDistance;
        })
      )
      .subscribe((estimationsDistance) => {
        this.estimationDistances$.next(estimationsDistance);
      });

    this.backendWsService
      .getUpdateMessageContent$()
      .pipe(
        filter((updateContent) => has(updateContent, "estimationsNombre")),
        map((updateContent) => {
          return updateContent.estimationsNombre;
        })
      )
      .subscribe((estimationsNombre) => {
        this.estimationNombres$.next(estimationsNombre);
      });

    this.backendWsService
      .getUpdateMessageContent$()
      .pipe(
        filter((updateContent) => has(updateContent, "comportements")),
        map((updateContent) => {
          return updateContent.comportements;
        })
      )
      .subscribe((comportements) => {
        this.comportements$.next(comportements);
      });

    this.backendWsService
      .getUpdateMessageContent$()
      .pipe(
        filter((updateContent) => has(updateContent, "milieux")),
        map((updateContent) => {
          return updateContent.milieux;
        })
      )
      .subscribe((milieux) => {
        this.milieux$.next(milieux);
      });

    this.especes$ = combineLatest(this.especesFlat$, this.classes$).pipe(
      map(([especes, classes]) => {
        return especes?.map((espece) => {
          const matchingClasse = classes?.find((classe) => {
            return espece.classeId === classe.id;
          });
          return {
            ...espece,
            classe: matchingClasse
          };
        }) ?? [];
      })
    );

    this.donneeEntities$ = combineLatest(
      this.classes$,
      this.especes$,
      this.ages$,
      this.sexes$,
      this.estimationNombres$,
      this.estimationDistances$,
      this.comportements$,
      this.milieux$
    ).pipe(
      map(
        ([
          classes,
          especes,
          ages,
          sexes,
          estimationsNombre,
          estimationsDistance,
          comportements,
          milieux
        ]) => {
          return {
            classes,
            especes,
            ages,
            sexes,
            estimationsNombre,
            estimationsDistance,
            comportements,
            milieux
          };
        }
      )
    );
  };

  public getDonneeEntities$ = (): Observable<{
    classes: Classe[];
    especes: UIEspece[];
    ages: Age[];
    sexes: Sexe[];
    estimationsNombre: EstimationNombre[];
    estimationsDistance: EstimationDistance[];
    comportements: Comportement[];
    milieux: Milieu[];
  }> => {
    return this.donneeEntities$;
  };

}
