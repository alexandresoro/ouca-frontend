import { Location } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Apollo, gql } from "apollo-angular";
import deburr from 'lodash.deburr';
import {
  BehaviorSubject,
  combineLatest,
  merge,
  Observable,
  Subject
} from "rxjs";
import { filter, map, takeUntil, withLatestFrom } from "rxjs/operators";
import { getCoordinates } from 'src/app/model/coordinates-system/coordinates-helper';
import { COORDINATES_SYSTEMS_CONFIG } from "src/app/model/coordinates-system/coordinates-system-list.object";
import { CoordinatesSystem, CoordinatesSystemType } from 'src/app/model/coordinates-system/coordinates-system.object';
import { Commune, Departement, LieuDit } from "src/app/model/graphql";
import { Lieudit } from "src/app/model/types/lieudit.model";
import { FormValidatorHelper } from "src/app/modules/shared/helpers/form-validator.helper";
import { has } from 'src/app/modules/shared/helpers/utils';
import { CrossFieldErrorMatcher } from "src/app/modules/shared/matchers/cross-field-error.matcher";
import { CoordinatesBuilderService } from "src/app/services/coordinates-builder.service";
import { EntitiesStoreService } from "src/app/services/entities-store.service";
import { EntiteSimpleEditAbstractComponent } from "../entite-simple/entite-simple-edit.component";

type LieuxDitsQueryResult = {
  lieuxDits: LieuDit[],
  communes: Commune[],
  departements: Departement[],
  settings: {
    coordinatesSystem: CoordinatesSystemType
  }
}

const LIEUX_DITS_QUERY = gql`
  query {
    lieuxDits {
      id
      nom
      altitude
      longitude
      latitude
      coordinatesSystem
      communeId
    }
    communes {
      id
      code
      departementId
      nom
    }
    departements {
      id
      code
    }
    settings {
      coordinatesSystem
    }
  }
`;

@Component({
  styleUrls: ["./lieu-dit-edit.component.scss"],
  templateUrl: "./lieu-dit-edit.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LieuDitEditComponent
  extends EntiteSimpleEditAbstractComponent<LieuDit>
  implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject();

  private lieuxDits$: Observable<LieuDit[]>;

  public departements$: Observable<Departement[]>;

  private communes$: Observable<Commune[]>;

  private communesSubj$: BehaviorSubject<Commune[]> = new BehaviorSubject<Commune[]>([]);

  public filteredCommunes$: BehaviorSubject<Commune[]> = new BehaviorSubject<
    Commune[]
  >(null);

  public coordinatesSystem$: Observable<CoordinatesSystem>;

  public coordinatesSystemSubj$: BehaviorSubject<CoordinatesSystem> = new BehaviorSubject<CoordinatesSystem>(null);

  public areCoordinatesTransformed$: BehaviorSubject<
    boolean
  > = new BehaviorSubject(false);

  public areCoordinatesInvalid$: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );

  public lieuditNomErrorStateMatcher = new CrossFieldErrorMatcher(
    "alreadyExistingNom"
  );

  constructor(
    private apollo: Apollo,
    private coordinatesBuilderService: CoordinatesBuilderService,
    entitiesStoreService: EntitiesStoreService,
    route: ActivatedRoute,
    router: Router,
    location: Location
  ) {
    super(entitiesStoreService, router, route, location);
  }

  ngOnInit(): void {
    const queryResult$ = this.apollo.watchQuery<LieuxDitsQueryResult>({
      query: LIEUX_DITS_QUERY
    }).valueChanges;

    this.lieuxDits$ = queryResult$.pipe(
      map(({ data }) => {
        return data?.lieuxDits;
      })
    );

    this.communes$ = queryResult$.pipe(
      map(({ data }) => {
        return data?.communes;
      })
    );

    this.departements$ = queryResult$.pipe(
      map(({ data }) => {
        return data?.departements;
      })
    );

    this.coordinatesSystem$ = queryResult$.pipe(
      map(({ data }) => {
        return COORDINATES_SYSTEMS_CONFIG[data?.settings?.coordinatesSystem];
      })
    );

    this.communes$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(this.communesSubj$);

    this.coordinatesSystem$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(this.coordinatesSystemSubj$);

    this.initialize();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected initialize(): void {
    super.initialize();

    this.getEntities$()
      .pipe(takeUntil(this.destroy$))
      .subscribe((entities) => {
        this.updateLieuDitValidators(this.getForm(), entities);
      });

    const departementControl = this.getForm().controls.departement;
    const codeCommuneControl = this.getForm().controls.communeId;
    const nomCommuneControl = this.getForm().controls.nomCommune;

    const departmentChange$ = merge(
      departementControl.valueChanges as Observable<number>,
      this.getEntityToDisplay$().pipe(
        withLatestFrom(this.communes$),
        filter(([lieuDit, communes]) => {
          const departementId = communes?.find(commune => commune.id === lieuDit.id)?.departementId;
          return !!lieuDit.communeId && !!departementId;
        }),
        map(([lieuDit, communes]) => {
          const departementId = communes?.find(commune => commune.id === lieuDit.id)?.departementId;
          return departementId;
        })
      )
    );

    // Filter the list of "Communes" depending on the selected "Département"
    combineLatest(
      departmentChange$,
      this.communes$,
      (selectedDepartement, communes) => {
        if (!communes || !communes.length || selectedDepartement == null) {
          return [];
        }

        return communes.filter((commune) => {
          return commune.departementId === selectedDepartement;
        });
      }
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe((filteredCommunes) => {
        this.filteredCommunes$.next(filteredCommunes);
      });

    codeCommuneControl.valueChanges.subscribe((selectedCommuneId: number) => {
      nomCommuneControl.setValue(selectedCommuneId, {
        emitEvent: false
      });
    });

    nomCommuneControl.valueChanges.subscribe((selectedCommuneId: number) => {
      codeCommuneControl.setValue(selectedCommuneId, {
        emitEvent: false
      });
    });

    combineLatest(this.coordinatesSystem$, this.getEntityToDisplay$())
      .pipe(takeUntil(this.destroy$))
      .subscribe(([coordinatesSystem, lieuDit]) => {
        if (!this.getForm().contains("longitude")) {
          this.getForm().addControl("longitude", new FormControl());
          this.getForm().addControl("latitude", new FormControl());
        }

        if (has(lieuDit, "longitude")) {

          const coordinates = getCoordinates(
            {
              coordinates: {
                system: lieuDit.coordinatesSystem,
                latitude: lieuDit.latitude,
                longitude: lieuDit.longitude
              }
            },
            coordinatesSystem.code
          );

          if (coordinates.areInvalid) {
            this.getForm().removeControl("longitude");
            this.getForm().removeControl("latitude");
          } else {
            this.getForm().controls.longitude.setValue(coordinates?.longitude);
            this.getForm().controls.latitude.setValue(coordinates?.latitude);
          }
          this.areCoordinatesTransformed$.next(!!coordinates?.areTransformed);
          this.areCoordinatesInvalid$.next(!!coordinates?.areInvalid);
        }

        // Update the coordinates validators depending on the current coordinates system
        if (this.getForm().contains("longitude")) {
          this.coordinatesBuilderService.updateCoordinatesValidators(
            coordinatesSystem.code,
            this.getForm().controls.longitude,
            this.getForm().controls.latitude
          );
        }
      });
  }

  public createForm(): FormGroup {
    return new FormGroup({
      id: new FormControl(),
      departement: new FormControl("", [Validators.required]),
      communeId: new FormControl("", [Validators.required]),
      nomCommune: new FormControl("", [Validators.required]),
      nom: new FormControl("", [Validators.required]),
      altitude: new FormControl("", [
        Validators.required,
        this.altitudeNumberValidator()
      ]),
      longitude: new FormControl(),
      latitude: new FormControl()
    });
  }

  protected getFormValue(
    lieuDit: LieuDit
  ): {
    id: number;
    departement: number;
    communeId: number;
    nomCommune: number;
    nom: string;
    altitude: number;
    longitude: number;
    latitude: number;
  } {
    const departementId = this.communesSubj$.value?.find(commune => commune.id === lieuDit.communeId)?.departementId;
    return {
      id: lieuDit.id,
      departement: departementId,
      communeId: lieuDit.communeId,
      nomCommune: lieuDit.communeId,
      nom: lieuDit.nom,
      altitude: lieuDit.altitude,
      longitude: lieuDit.longitude,
      latitude: lieuDit.latitude
    };
  }

  getEntityFromFormValue(formValue: {
    id: number;
    nomCommune: number;
    communeId: number;
    nom: string;
    altitude: number;
    longitude?: number;
    latitude?: number;
    coordinatesSystem: CoordinatesSystemType;
  }): Lieudit {
    const lieuDit: Lieudit = {
      id: formValue?.id ?? null,
      communeId: formValue.communeId,
      nom: formValue.nom,
      altitude: formValue.altitude
    };

    if (has(formValue, "longitude")) {
      lieuDit.coordinates = {
        longitude: formValue.longitude,
        latitude: formValue.latitude,
        system: this.coordinatesSystemSubj$.value?.code
      };
    }

    return lieuDit;
  }

  public getFormType(): null {
    return null;
  }

  public getEntityName = (): string => {
    return "lieudit";
  };

  public getEntities$(): Observable<LieuDit[]> {
    return this.lieuxDits$;
  }

  private updateLieuDitValidators = (
    form: FormGroup,
    lieuxDits: LieuDit[]
  ): void => {
    form.setValidators([this.nomValidator(lieuxDits)]);
    form.updateValueAndValidity();
  };

  private nomValidator = (lieuxDits: LieuDit[]): ValidatorFn => {
    return (form: FormGroup): ValidationErrors | null => {
      const nom: string = form.controls.nom.value;
      const communeId: number = form.controls.communeId.value;
      const currentLieuDitId: number = form.controls.id.value;

      const matchingLieuDit =
        nom && communeId
          ? lieuxDits?.find((lieuDit) => {
            return (
              deburr(lieuDit.nom.trim().toLowerCase()) ===
              deburr(nom.trim().toLowerCase()) &&
              lieuDit.communeId === communeId
            );
          })
          : null;

      const valueIsAnExistingEntity: boolean =
        !!matchingLieuDit && currentLieuDitId !== matchingLieuDit.id;

      return valueIsAnExistingEntity
        ? {
          alreadyExistingNom: {
            message:
              "Il existe déjà un lieu-dit avec ce nom dans cette commune."
          }
        }
        : null;
    };
  };

  private altitudeNumberValidator(): ValidatorFn {
    return FormValidatorHelper.isAnIntegerValidator(0, 65535);
  }

  public getPageTitle = (): string => {
    return "Lieux-dits";
  };

  public getCreationTitle = (): string => {
    return "Création d'un lieu-dit";
  };

  public getEditionTitle = (): string => {
    return "Edition d'un lieu-dit";
  };
}
