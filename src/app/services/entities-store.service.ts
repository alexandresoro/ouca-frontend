import { Injectable } from "@angular/core";
import * as _ from "lodash";
import { Age } from "ouca-common/age.object";
import { Classe } from "ouca-common/classe.object";
import { Commune } from "ouca-common/commune.model";
import { Comportement } from "ouca-common/comportement.object";
import { Departement } from "ouca-common/departement.object";
import { EntiteSimple } from "ouca-common/entite-simple.object";
import { Espece } from "ouca-common/espece.model";
import { EstimationDistance } from "ouca-common/estimation-distance.object";
import { EstimationNombre } from "ouca-common/estimation-nombre.object";
import { Lieudit } from "ouca-common/lieudit.model";
import { Meteo } from "ouca-common/meteo.object";
import { Milieu } from "ouca-common/milieu.object";
import { Observateur } from "ouca-common/observateur.object";
import { PostResponse } from "ouca-common/post-response.object";
import { Sexe } from "ouca-common/sexe.object";
import { combineLatest, Observable, ReplaySubject } from "rxjs";
import { filter, map, tap } from "rxjs/operators";
import { UICommune } from "../models/commune.model";
import { UIEspece } from "../models/espece.model";
import { UILieudit } from "../models/lieudit.model";
import { ENTITIES_PROPERTIES } from "../modules/model-management/models/entities-properties.model";
import { BackendApiService } from "./backend-api.service";
import { BackendWsService } from "./backend-ws.service";
import { StatusMessageService } from "./status-message.service";

@Injectable({
  providedIn: "root"
})
export class EntitiesStoreService {
  private observateurs$: ReplaySubject<Observateur[]> = new ReplaySubject<
    Observateur[]
  >(1);

  private lieuxdits$: Observable<UILieudit[]>;

  private lieuxditsFlat$: ReplaySubject<Lieudit[]> = new ReplaySubject<
    Lieudit[]
  >(1);

  private communes$: Observable<UICommune[]>;

  private communesFlat$: ReplaySubject<Commune[]> = new ReplaySubject<
    Commune[]
  >(1);

  private departements$: ReplaySubject<Departement[]> = new ReplaySubject<
    Departement[]
  >(1);

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

  private comportements$: ReplaySubject<Comportement[]> = new ReplaySubject<
    Comportement[]
  >(1);

  private milieux$: ReplaySubject<Milieu[]> = new ReplaySubject<Milieu[]>(1);

  private meteos$: ReplaySubject<Meteo[]> = new ReplaySubject<Meteo[]>(1);

  private inventaireEntities$: Observable<{
    observateurs: Observateur[];
    departements: Departement[];
    lieudits: UILieudit[];
    communes: UICommune[];
    meteos: Meteo[];
  }>;

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
    private backendApiService: BackendApiService,
    private backendWsService: BackendWsService,

    private statusMessageService: StatusMessageService
  ) {
    this.backendWsService
      .getUpdateMessageContent$()
      .pipe(
        filter((updateContent) => _.has(updateContent, "observateurs")),
        map((updateContent) => {
          return updateContent.observateurs;
        })
      )
      .subscribe((observateurs) => {
        this.observateurs$.next(observateurs);
      });

    this.backendWsService
      .getUpdateMessageContent$()
      .pipe(
        filter((updateContent) => _.has(updateContent, "lieuxdits")),
        map((updateContent) => {
          return updateContent.lieuxdits;
        })
      )
      .subscribe((lieuxdits) => {
        this.lieuxditsFlat$.next(lieuxdits);
      });

    this.backendWsService
      .getUpdateMessageContent$()
      .pipe(
        filter((updateContent) => _.has(updateContent, "communes")),
        map((updateContent) => {
          return updateContent.communes;
        })
      )
      .subscribe((communes) => {
        this.communesFlat$.next(communes);
      });

    this.backendWsService
      .getUpdateMessageContent$()
      .pipe(
        filter((updateContent) => _.has(updateContent, "departements")),
        map((updateContent) => {
          return updateContent.departements;
        })
      )
      .subscribe((departements) => {
        this.departements$.next(departements);
      });

    this.backendWsService
      .getUpdateMessageContent$()
      .pipe(
        filter((updateContent) => _.has(updateContent, "classes")),
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
        filter((updateContent) => _.has(updateContent, "especes")),
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
        filter((updateContent) => _.has(updateContent, "sexes")),
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
        filter((updateContent) => _.has(updateContent, "ages")),
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
        filter((updateContent) => _.has(updateContent, "estimationsDistance")),
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
        filter((updateContent) => _.has(updateContent, "estimationsNombre")),
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
        filter((updateContent) => _.has(updateContent, "comportements")),
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
        filter((updateContent) => _.has(updateContent, "milieux")),
        map((updateContent) => {
          return updateContent.milieux;
        })
      )
      .subscribe((milieux) => {
        this.milieux$.next(milieux);
      });

    this.backendWsService
      .getUpdateMessageContent$()
      .pipe(
        filter((updateContent) => _.has(updateContent, "meteos")),
        map((updateContent) => {
          return updateContent.meteos;
        })
      )
      .subscribe((meteos) => {
        this.meteos$.next(meteos);
      });

    this.communes$ = combineLatest(this.communesFlat$, this.departements$).pipe(
      map(([communes, departements]) => {
        return _.map(communes, (commune) => {
          const matchingDepartement = _.find(departements, (departement) => {
            return commune.departementId === departement.id;
          });
          return {
            ...commune,
            departement: matchingDepartement
          };
        });
      })
    );

    this.lieuxdits$ = combineLatest(this.lieuxditsFlat$, this.communes$).pipe(
      map(([lieuxdits, communes]) => {
        return _.map(lieuxdits, (lieudit) => {
          const matchingCommune = _.find(communes, (commune) => {
            return lieudit.communeId === commune.id;
          });
          return {
            ...lieudit,
            commune: matchingCommune
          };
        });
      })
    );

    this.especes$ = combineLatest(this.especesFlat$, this.classes$).pipe(
      map(([especes, classes]) => {
        return _.map(especes, (espece) => {
          const matchingClasse = _.find(classes, (classe) => {
            return espece.classeId === classe.id;
          });
          return {
            ...espece,
            classe: matchingClasse
          };
        });
      })
    );

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

  public getObservateurs$ = (): Observable<Observateur[]> => {
    return this.observateurs$.asObservable();
  };

  public getLieuxdits$ = (): Observable<UILieudit[]> => {
    return this.lieuxdits$;
  };

  public getCommunes$ = (): Observable<UICommune[]> => {
    return this.communes$;
  };

  public getDepartements$ = (): Observable<Departement[]> => {
    return this.departements$.asObservable();
  };

  public getClasses$ = (): Observable<Classe[]> => {
    return this.classes$.asObservable();
  };

  public getEspeces$ = (): Observable<UIEspece[]> => {
    return this.especes$;
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
    lieudits: UILieudit[];
    meteos: Meteo[];
  }> => {
    return this.inventaireEntities$;
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

  public saveEntity = <E extends EntiteSimple>(
    entity: E,
    entityName: string
  ): Observable<boolean> => {
    return this.backendApiService.saveEntity(entityName, entity).pipe(
      tap((response: PostResponse) => {
        if (response.isSuccess) {
          this.statusMessageService.showSuccessMessage(
            ENTITIES_PROPERTIES[entityName].theEntityLabelUppercase +
              " a été sauvegardé" +
              (ENTITIES_PROPERTIES[entityName].isFeminine ? "e" : "") +
              " avec succès."
          );
        } else {
          this.statusMessageService.showErrorMessage(
            "Une erreur est survenue pendant la sauvegarde.",
            response.message
          );
        }
      }),
      map((response: PostResponse) => response.isSuccess)
    );
  };

  public deleteEntity = (
    id: number,
    entityName: string
  ): Observable<boolean> => {
    return this.backendApiService.deleteEntity(entityName, id).pipe(
      tap((response: PostResponse) => {
        if (response.isSuccess) {
          this.statusMessageService.showSuccessMessage(
            ENTITIES_PROPERTIES[entityName].theEntityLabelUppercase +
              " a été supprimé" +
              (ENTITIES_PROPERTIES[entityName].isFeminine ? "e" : "") +
              " avec succès."
          );
        } else {
          this.statusMessageService.showErrorMessage(
            "Une erreur est survenue pendant la suppression.",
            response.message
          );
        }
      }),
      map((response: PostResponse) => response.isSuccess)
    );
  };
}
