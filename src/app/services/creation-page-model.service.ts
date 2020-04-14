import { Injectable } from "@angular/core";
import { Age } from "ouca-common/age.object";
import { Classe } from "ouca-common/classe.object";
import { Commune } from "ouca-common/commune.object";
import { Comportement } from "ouca-common/comportement.object";
import { Departement } from "ouca-common/departement.object";
import { EntiteSimple } from "ouca-common/entite-simple.object";
import { Espece } from "ouca-common/espece.object";
import { EstimationDistance } from "ouca-common/estimation-distance.object";
import { EstimationNombre } from "ouca-common/estimation-nombre.object";
import { Lieudit } from "ouca-common/lieudit.object";
import { Meteo } from "ouca-common/meteo.object";
import { Milieu } from "ouca-common/milieu.object";
import { Observateur } from "ouca-common/observateur.object";
import { Sexe } from "ouca-common/sexe.object";
import { BehaviorSubject, combineLatest, Observable, Subject } from "rxjs";
import { distinctUntilChanged, filter, map } from "rxjs/operators";
import { BackendApiService } from "./backend-api.service";
import { StatusMessageService } from "./status-message.service";

@Injectable({
  providedIn: "root"
})
export class CreationPageModelService {
  private observateurs$: BehaviorSubject<Observateur[]> = new BehaviorSubject<
    Observateur[]
  >([]);

  private lieuxdits$: BehaviorSubject<Lieudit[]> = new BehaviorSubject<
    Lieudit[]
  >([]);

  private communes$: BehaviorSubject<Commune[]> = new BehaviorSubject<
    Commune[]
  >([]);

  private departements$: BehaviorSubject<Departement[]> = new BehaviorSubject<
    Departement[]
  >([]);

  private classes$: BehaviorSubject<Classe[]> = new BehaviorSubject<Classe[]>(
    []
  );

  private especes$: BehaviorSubject<Espece[]> = new BehaviorSubject<Espece[]>(
    []
  );

  private sexes$: BehaviorSubject<Sexe[]> = new BehaviorSubject<Sexe[]>([]);

  private ages$: BehaviorSubject<Age[]> = new BehaviorSubject<Age[]>([]);

  private estimationNombres$: BehaviorSubject<
    EstimationNombre[]
  > = new BehaviorSubject<EstimationNombre[]>([]);

  private estimationDistances$: BehaviorSubject<
    EstimationDistance[]
  > = new BehaviorSubject<EstimationDistance[]>([]);

  private comportements$: BehaviorSubject<Comportement[]> = new BehaviorSubject<
    Comportement[]
  >([]);

  private milieux$: BehaviorSubject<Milieu[]> = new BehaviorSubject<Milieu[]>(
    []
  );

  private meteos$: BehaviorSubject<Meteo[]> = new BehaviorSubject<Meteo[]>([]);

  private inventaireEntities$: Observable<{
    observateurs: Observateur[];
    departements: Departement[];
    lieudits: Lieudit[];
    communes: Commune[];
    meteos: Meteo[];
  }>;

  private donneeEntities$: Observable<{
    classes: Classe[];
    especes: Espece[];
    ages: Age[];
    sexes: Sexe[];
    estimationsNombre: EstimationNombre[];
    estimationsDistance: EstimationDistance[];
    comportements: Comportement[];
    milieux: Milieu[];
  }>;

  constructor(
    private backendApiService: BackendApiService,
    private statusMessageService: StatusMessageService
  ) {
    this.inventaireEntities$ = combineLatest(
      this.observateurs$,
      this.departements$,
      this.lieuxdits$,
      this.communes$,
      this.meteos$
    ).pipe(
      map(([observateurs, departements, lieudits, communes, meteos]) => {
        return {
          observateurs,
          departements,
          lieudits,
          communes,
          meteos
        };
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
  }

  public refreshPageModel = (): void => {
    this.refreshEntities("observateur", this.observateurs$);
    this.refreshEntities("commune", this.communes$);
    this.refreshEntities("departement", this.departements$);
    this.refreshEntities("lieudit", this.lieuxdits$);
    this.refreshEntities("classe", this.classes$);
    this.refreshEntities("espece", this.especes$);
    this.refreshEntities("sexe", this.sexes$);
    this.refreshEntities("age", this.ages$);
    this.refreshEntities("estimation-nombre", this.estimationNombres$);
    this.refreshEntities("estimation-distance", this.estimationDistances$);
    this.refreshEntities("comportement", this.comportements$);
    this.refreshEntities("milieu", this.milieux$);
    this.refreshEntities("meteo", this.meteos$);
  };

  private refreshEntities = <T extends EntiteSimple>(
    entityName: string,
    observableToUpdate: Subject<T[]>
  ): void => {
    this.backendApiService
      .getAllEntities<T>(entityName)
      .subscribe((entities) => {
        // console.log("Entités %s", entityName, entities);
        if (!entities) {
          this.statusMessageService.showErrorMessage(
            "Impossible de charger le contenu des entités " + entityName
          );
        }
        observableToUpdate.next(entities ?? []);
      });
  };

  public getObservateurs$ = (): Observable<Observateur[]> => {
    return this.observateurs$.asObservable();
  };

  public getLieuxdits$ = (): Observable<Lieudit[]> => {
    return this.lieuxdits$.asObservable();
  };

  public getCommunes$ = (): Observable<Commune[]> => {
    return this.communes$.asObservable();
  };

  public getDepartements$ = (): Observable<Departement[]> => {
    return this.departements$.asObservable();
  };

  public getClasses$ = (): Observable<Classe[]> => {
    return this.classes$.asObservable();
  };

  public getEspeces$ = (): Observable<Espece[]> => {
    return this.especes$.asObservable();
  };

  public getSexes$ = (): Observable<Sexe[]> => {
    return this.sexes$.asObservable();
  };

  public getAges$ = (): Observable<Age[]> => {
    return this.ages$.asObservable();
  };

  public getEstimationNombres$ = (): Observable<EstimationNombre[]> => {
    return this.estimationNombres$.asObservable();
  };

  public getEstimationDistances$ = (): Observable<EstimationDistance[]> => {
    return this.estimationDistances$.asObservable();
  };

  public getComportements$ = (): Observable<Comportement[]> => {
    return this.comportements$.asObservable();
  };

  public getMilieux$ = (): Observable<Milieu[]> => {
    return this.milieux$.asObservable();
  };

  public getMeteos$ = (): Observable<Meteo[]> => {
    return this.meteos$.asObservable();
  };

  public getInventaireEntities$ = (): Observable<{
    observateurs: Observateur[];
    departements: Departement[];
    lieudits: Lieudit[];
    communes: Commune[];
    meteos: Meteo[];
  }> => {
    return this.inventaireEntities$.pipe(
      filter((entities) => {
        return this.isContainingRequiredDataForInventaire(entities);
      })
    );
  };

  public getIsContainingRequiredDataForInventaire = (): Observable<boolean> => {
    return this.inventaireEntities$.pipe(
      map((entities) => this.isContainingRequiredDataForInventaire(entities)),
      distinctUntilChanged()
    );
  };

  private isContainingRequiredDataForInventaire = (entities: {
    observateurs: Observateur[];
    departements: Departement[];
    lieudits: Lieudit[];
    communes: Commune[];
    meteos: Meteo[];
  }): boolean => {
    return (
      !!entities?.observateurs?.length &&
      !!entities?.departements?.length &&
      !!entities?.lieudits?.length &&
      !!entities?.communes?.length
    );
  };

  public getDonneeEntities$ = (): Observable<{
    classes: Classe[];
    especes: Espece[];
    ages: Age[];
    sexes: Sexe[];
    estimationsNombre: EstimationNombre[];
    estimationsDistance: EstimationDistance[];
    comportements: Comportement[];
    milieux: Milieu[];
  }> => {
    return this.donneeEntities$.pipe(
      filter((entities) => this.isContainingRequiredDataForDonnee(entities))
    );
  };

  public getIsContainingRequiredDataForDonnee = (): Observable<boolean> => {
    return this.donneeEntities$.pipe(
      map((entities) => this.isContainingRequiredDataForDonnee(entities)),
      distinctUntilChanged()
    );
  };

  private isContainingRequiredDataForDonnee = (entities: {
    classes: Classe[];
    especes: Espece[];
    ages: Age[];
    sexes: Sexe[];
    estimationsNombre: EstimationNombre[];
    estimationsDistance: EstimationDistance[];
    comportements: Comportement[];
    milieux: Milieu[];
  }): boolean => {
    return (
      !!entities?.classes?.length &&
      !!entities?.especes?.length &&
      !!entities?.comportements?.length &&
      !!entities?.milieux?.length
    );
  };
}
