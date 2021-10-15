import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from "@angular/forms";
import { Apollo, gql } from "apollo-angular";
import L from 'leaflet';
import {
  BehaviorSubject,
  combineLatest,
  EMPTY,
  iif,
  Observable,
  of,

  Subject
} from "rxjs";
import { debounceTime, delay, distinctUntilChanged, filter, map, startWith, switchMap, takeUntil, withLatestFrom } from "rxjs/operators";
import { areSameCoordinates, getCoordinates } from 'src/app/model/coordinates-system/coordinates-helper';
import { CoordinatesSystem } from 'src/app/model/coordinates-system/coordinates-system.object';
import { Commune, CoordinatesSystemType, Departement, LieuDit, QueryCommunesArgs, QueryDepartementsArgs, QueryLieuDitArgs, QueryLieuxDitsArgs } from "src/app/model/graphql";
import { Coordinates } from 'src/app/model/types/coordinates.object';
import autocompleteUpdaterObservable, { autocompleteWithParentHandler } from "src/app/modules/shared/helpers/autocomplete-updater-observable";
import { getLieuxDitsCoordinates } from 'src/app/modules/shared/helpers/coordinates-helper';
import { FormValidatorHelper } from "src/app/modules/shared/helpers/form-validator.helper";
import { distinctUntilKeyChangedLoose } from 'src/app/modules/shared/rx-operators';
import { CoordinatesService } from "src/app/services/coordinates.service";
import { CreationMapService } from 'src/app/services/creation-map.service';
import { CreationModeService } from 'src/app/services/creation-mode.service';
import { IgnAlticodageService } from 'src/app/services/ign-alticodage.service';

type DepartementsQueryResult = {
  departements: Departement[]
}

type CommunesQueryResult = {
  communes: Commune[]
}

type LieuxDitsQueryResult = {
  lieuxDits: LieuDit[]
}

type LieuxDitsCoordinatesQueryResult = {
  lieuxDits: Pick<LieuDit, 'id' | 'latitude' | 'longitude'>[]
}

type LieuDitQueryResult = {
  lieuDit: LieuDit
}

type CoordinatesQueryResult = {
  settings: {
    coordinatesSystem: CoordinatesSystemType
  }
}

const INPUT_LIEUX_DITS_COORDINATES_QUERY = gql`
  query LieuxDitsCoordinates($params: FindParams, $communeId: Int) {
    lieuxDits(params: $params, communeId: $communeId) {
      id
      longitude
      latitude
    }
  }
`;

const INPUT_DEPARTEMENTS_QUERY = gql`
  query Departements($params: FindParams) {
    departements(params: $params) {
      id
      code
    }
  }
`;

const INPUT_COMMUNES_QUERY = gql`
  query Communes($params: FindParams, $departementId: Int) {
    communes(params: $params, departementId: $departementId) {
      id
      code
      nom
      departement {
        id
        code
      }
    }
  }
`;

const INPUT_LIEUX_DITS_QUERY = gql`
  query LieuxDits($params: FindParams, $communeId: Int) {
    lieuxDits(params: $params, communeId: $communeId) {
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
  }
`;

const INPUT_SETTINGS_QUERY = gql`
  query {
    settings {
      id
      coordinatesSystem
    }
  }
`;

const INPUT_LIEUX_DIT_BY_ID_QUERY = gql`
  query LieuDit($id: Int!) {
    lieuDit(id: $id) {
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
  }
`;

@Component({
  selector: "input-lieudit",
  styleUrls: ["input-lieudit.component.scss"],
  templateUrl: "./input-lieudit.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputLieuditComponent implements OnInit, OnDestroy {
  @Input() public controlGroup: FormGroup;

  @Output() public searchInMapClick: EventEmitter<void> = new EventEmitter<void>();

  private readonly destroy$ = new Subject();

  public matchingDepartements$: Observable<Departement[]>;

  public matchingCommunes$: Observable<Commune[]>;

  public matchingLieuxDits$: Observable<LieuDit[]>;

  public areCoordinatesCustomized$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);
  public isCurrentSystemGps$: Observable<boolean>;

  public isSearchInMapButtonDisabled$: Observable<boolean>;

  // Event that is triggered when a request to display a given commune is done
  private focusOnCommuneEvent$ = new Subject<number>();

  // Event that is triggered when a request to display a given departement is done
  private focusOnDepartementEvent$ = new Subject<number>();

  public isOngoingAltitudeCall$ = new Subject<boolean>();
  public isOngoingAltitudeCallDelayed$ = this.isOngoingAltitudeCall$.pipe(
    switchMap((isOngoingCall) => {
      return iif(() => isOngoingCall,
        of(isOngoingCall).pipe(delay(500)),
        of(isOngoingCall),
      )
    }));

  public shouldDisplayOngoingCallForAltitudeMessage$ = combineLatest([this.areCoordinatesCustomized$, this.isOngoingAltitudeCallDelayed$]).pipe(
    map(([areCoordinatesCustomized, isOngoingAltitudeCallDelayed]) => {
      return areCoordinatesCustomized && isOngoingAltitudeCallDelayed;
    }));

  constructor(
    private apollo: Apollo,
    private coordinatesService: CoordinatesService,
    private creationModeService: CreationModeService,
    private creationMapService: CreationMapService,
    private ignAlticodageService: IgnAlticodageService
  ) {
  }

  public ngOnInit(): void {

    this.isCurrentSystemGps$ = this.apollo.watchQuery<CoordinatesQueryResult>({
      query: INPUT_SETTINGS_QUERY
    }).valueChanges.pipe(
      map(({ data }) => {
        return data?.settings?.coordinatesSystem === CoordinatesSystemType.Gps;
      })
    );

    const departementControl = this.controlGroup.get("departement");
    const communeControl = this.controlGroup.get("commune");
    const lieuditControl = this.controlGroup.get("lieudit");

    this.matchingDepartements$ = autocompleteUpdaterObservable(departementControl, (value: string) => {
      return this.apollo.query<DepartementsQueryResult, QueryDepartementsArgs>({
        query: INPUT_DEPARTEMENTS_QUERY,
        variables: {
          params: {
            q: value
          }
        }
      }).pipe(
        map(({ data }) => data?.departements)
      )
    });

    this.matchingCommunes$ = combineLatest([
      departementControl.valueChanges.pipe(
        distinctUntilKeyChangedLoose("id"),
        startWith<Departement | string>(null as Departement),
      ),
      communeControl.valueChanges.pipe(
        debounceTime<Commune | string>(150) // We debounce here, as I don't have any proper solution to do it only for the case we need to, like the other cases
      )
    ]).pipe(
      takeUntil(this.destroy$),
      switchMap(([departementValue, communeValue]) => {
        return autocompleteWithParentHandler([departementValue, communeValue], (departementValue, communeValue) => {
          return this.apollo.query<CommunesQueryResult, QueryCommunesArgs>({
            query: INPUT_COMMUNES_QUERY,
            variables: {
              params: {
                q: communeValue
              },
              departementId: departementValue?.id ?? null
            }
          }).pipe(
            map(({ data }) => data?.communes)
          );
        });
      })
    );

    this.matchingLieuxDits$ = combineLatest([
      communeControl.valueChanges.pipe(
        distinctUntilKeyChangedLoose("id"),
        startWith<Commune | string>(null as Commune),
      ),
      lieuditControl.valueChanges.pipe(
        debounceTime<LieuDit | string>(150) // We debounce here, as I don't have any proper solution to do it only for the case we need to, like the other cases
      )
    ]).pipe(
      takeUntil(this.destroy$),
      switchMap(([communeValue, lieuDitValue]) => {
        return autocompleteWithParentHandler([communeValue, lieuDitValue], (communeValue, lieuDitValue) => {
          return this.apollo.query<LieuxDitsQueryResult, QueryLieuxDitsArgs>({
            query: INPUT_LIEUX_DITS_QUERY,
            variables: {
              params: {
                q: lieuDitValue
              },
              communeId: communeValue?.id ?? null
            }
          }).pipe(
            map(({ data }) => data?.lieuxDits)
          );
        });
      })
    );

    departementControl.valueChanges.subscribe((value) => {
      value?.id && this.focusOnDepartementEvent$.next(value.id);
    });

    departementControl.valueChanges
      .pipe(distinctUntilKeyChangedLoose("id"))
      .subscribe(() => {
        communeControl.setValue(null);
      });

    communeControl.valueChanges
      .pipe(distinctUntilKeyChangedLoose("id"))
      .subscribe(() => {
        lieuditControl.setValue(null);
      });

    this.isSearchInMapButtonDisabled$ = this.creationModeService.getIsInventaireEnabled$().pipe((map(isInventaireEnabled => !isInventaireEnabled)));

    // Notify the map service when a lieu dit has changed
    combineLatest(
      [
        lieuditControl.valueChanges
          .pipe(
            map<{ id?: number }, number>((value) => value?.id),
            distinctUntilChanged()
          ),
        this.areCoordinatesCustomized$
      ])
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(([lieuditId, areCoordinatesCustomized]) => {
        if (areCoordinatesCustomized && lieuditId) {
          const latlng = new L.LatLng(this.controlGroup.controls.latitude.value as number, this.controlGroup.controls.longitude.value as number);
          this.creationMapService.setCustomMarkerPosition(latlng);
          this.creationMapService.setCustomMarkerInformation({
            isActive: true,
            linkedLieuDitId: lieuditId
          }, true);
        } else {
          this.creationMapService.setSelectedLieuDitId(lieuditId, true);
        }
      });

    // When the lieu dit is changed from the map, update the controls accordingly
    this.creationMapService.getLieuDitIdForControl$()
      .pipe(
        switchMap((lieuDitFromUI) => {
          if (lieuDitFromUI && lieuDitFromUI !== (lieuditControl.value as LieuDit)?.id) {
            return this.apollo.query<LieuDitQueryResult, QueryLieuDitArgs>({
              query: INPUT_LIEUX_DIT_BY_ID_QUERY,
              variables: {
                id: lieuDitFromUI
              }
            }).pipe(
              map(({ data }) => data?.lieuDit)
            )
          } else {
            return EMPTY;
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((lieuDit) => {
        departementControl.markAsPristine();
        departementControl.setValue(lieuDit?.commune?.departement);

        communeControl.markAsPristine();
        communeControl.setValue(lieuDit?.commune);

        lieuditControl.markAsPristine();
        lieuditControl.setValue(lieuDit);
      });


    // Manage custom markers updated from UI
    this.creationMapService.getCustomMarkerPosition$()
      .pipe(
        filter(markerPosition => markerPosition.isSetByMap), // Only listen to actual changes done by UI
        map(markerPosition => markerPosition?.coordinates),
        withLatestFrom(this.getCoordinatesSystem$()),
        takeUntil(this.destroy$)
      ).subscribe(([coordinates, coordinatesSystem]) => {
        if (coordinates?.lat && coordinates?.lng) {
          if (this.controlGroup.controls.latitude.value !== coordinates.lat) {
            this.controlGroup.controls.latitude.markAsPristine();
            this.controlGroup.controls.latitude.setValue(coordinates.lat);
          }
          if (this.controlGroup.controls.longitude.value !== coordinates.lng) {
            this.controlGroup.controls.longitude.markAsPristine();
            this.controlGroup.controls.longitude.setValue(coordinates.lng);
          }

          // request the altitude for this position
          this.retrieveAltitude([coordinates.lat, coordinates.lng]);

        } else {
          const lieudit = this.controlGroup.controls.lieudit.value;
          if (lieudit?.id) {
            const coordinatesToSet = this.getCoordinatesOfLieuDit([lieudit, coordinatesSystem]);
            this.controlGroup.controls.latitude.markAsPristine();
            this.controlGroup.controls.latitude.setValue(coordinatesToSet.latitude);
            this.controlGroup.controls.longitude.markAsPristine();
            this.controlGroup.controls.longitude.setValue(coordinatesToSet.longitude);
            this.controlGroup.controls.altitude.markAsPristine();
            this.controlGroup.controls.altitude.setValue(coordinatesToSet.altitude);
          }

        }
      });

    // When a lieu dit control becomes invalid, we send it anyway as "null" focus, to reset properly the markers on the map
    lieuditControl.valueChanges
      .pipe(
        filter((value) => !(value?.id)),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.creationMapService.setFocusedLieuDitId(null);
      });

    // Focus on lieu dit if this is a valid lieu dit set in the control
    lieuditControl.valueChanges
      .pipe(
        filter((value) => !!value?.id),
        takeUntil(this.destroy$)
      )
      .subscribe((lieuDit: LieuDit) => {
        lieuDit?.latitude && lieuDit?.longitude && this.creationMapService.setCoordinatesToFocus([[lieuDit.latitude, lieuDit.longitude]]);
      });

    // Focus on the commune if no lieu dit is selected
    this.focusOnCommuneEvent$
      .pipe(
        switchMap((communeId) => {
          const currentLieuDitId = this.controlGroup.controls?.lieudit?.value?.id;
          if (communeId && !currentLieuDitId) {
            return this.apollo.query<LieuxDitsCoordinatesQueryResult, QueryLieuxDitsArgs>({
              query: INPUT_LIEUX_DITS_COORDINATES_QUERY,
              variables: {
                communeId
              }
            }).pipe(
              map(({ data }) => data?.lieuxDits)
            )
          } else {
            return EMPTY;
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((lieuxDitsOfCommuneCoordinates) => {
        this.creationMapService.setCoordinatesToFocus(
          lieuxDitsOfCommuneCoordinates.map(getLieuxDitsCoordinates)
        );
      });

    // Focus should be on the departement if no commune is selected
    this.focusOnDepartementEvent$
      .pipe(
        switchMap((departementId) => {
          const currentCommuneId = this.controlGroup.controls?.commune?.value?.id;
          if (departementId && !currentCommuneId) {
            return this.apollo.query<LieuxDitsCoordinatesQueryResult, QueryLieuxDitsArgs>({
              query: INPUT_LIEUX_DITS_COORDINATES_QUERY,
              variables: {
                departementId
              }
            }).pipe(
              map(({ data }) => data?.lieuxDits)
            )
          } else {
            return EMPTY;
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((lieuxDitsOfDepartementCoordinates) => {
        this.creationMapService.setCoordinatesToFocus(
          lieuxDitsOfDepartementCoordinates.map(getLieuxDitsCoordinates)
        );
      });

    // Set the coordinates that should be display when the lieu dit selected changes
    this.getCoordinatesToDisplay$(lieuditControl).subscribe(this.displayCoordinates);

    // Observable that checks if coordinates are customized
    this.updateAreCoordinatesCustomized();

    this.getAreCoordinatesInvalid$()
      .pipe(distinctUntilChanged())
      .pipe(takeUntil(this.destroy$))
      .subscribe((areInvalid) => {
        this.updateCoordinatesControls(this.controlGroup, areInvalid);
      });

  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public retrieveAltitude = (coordinates: [number, number]): void => {
    this.isOngoingAltitudeCall$.next(true);
    this.ignAlticodageService.getAltitudeForCoordinates(coordinates)
      .subscribe((altitude) => {
        if (altitude != null) {
          // Set the new altitude
          this.controlGroup.controls.altitude.markAsPristine();
          this.controlGroup.controls.altitude.setValue(Math.round(altitude));
          this.isOngoingAltitudeCall$.next(false);
        }
      });
  }

  public onDepartementControlFocused = (): void => {
    this.focusOnDepartementEvent$.next(this.controlGroup.controls?.departement?.value?.id);
  }

  public onDepartementControlActivated = (departement: Departement): void => {
    this.focusOnDepartementEvent$.next(departement?.id);
  }

  public onCommuneControlFocused = (): void => {
    this.focusOnCommuneEvent$.next(this.controlGroup.controls?.commune?.value?.id);
  }

  public onCommuneControlActivated = (commune: Commune): void => {
    this.focusOnCommuneEvent$.next(commune?.id);
  }

  private focusOnLieuDit = (lieuDit: LieuDit): void => {
    lieuDit?.id && this.creationMapService.setFocusedLieuDitId(lieuDit?.id);
    lieuDit && this.creationMapService.setCoordinatesToFocus([[lieuDit.latitude, lieuDit.longitude]]);
  }

  public onLieuDitControlFocused = (): void => {
    const currentLieuDitId = this.controlGroup.controls?.lieudit?.value;
    this.focusOnLieuDit(currentLieuDitId);
  }

  public onLieuDitActivated = (lieuDit: LieuDit): void => {
    this.focusOnLieuDit(lieuDit);
  }
  public getCoordinatesInputStep = (coordinatesSystem: CoordinatesSystem): number => {
    return coordinatesSystem?.decimalPlaces ? Math.pow(10, -coordinatesSystem.decimalPlaces) : 1;
  }

  private getCoordinatesOfLieuDit = ([selectedLieudit, coordinatesSystem]: [LieuDit, CoordinatesSystem]): {
    altitude: number;
    longitude: number;
    latitude: number;
    areTransformed: boolean;
    areInvalid: boolean;
  } => {
    if (selectedLieudit?.id && coordinatesSystem?.code) {
      const coordinates = getCoordinates(
        {
          coordinates: {
            latitude: selectedLieudit?.latitude,
            longitude: selectedLieudit?.longitude,
            system: selectedLieudit?.coordinatesSystem
          }
        },
        coordinatesSystem.code
      );

      return {
        altitude: selectedLieudit.altitude,
        longitude: coordinates.longitude,
        latitude: coordinates.latitude,
        areTransformed: !!coordinates.areTransformed,
        areInvalid: !!coordinates.areInvalid
      };
    }

    return {
      altitude: null,
      longitude: null,
      latitude: null,
      areTransformed: false,
      areInvalid: false
    };
  };

  private getCoordinatesToDisplay$ = (
    lieuditControl: AbstractControl
  ): Observable<{
    altitude: number;
    longitude: number;
    latitude: number;
    areTransformed: boolean;
    areInvalid: boolean;
  }> => {
    return combineLatest(
      [
        (lieuditControl.valueChanges as Observable<LieuDit>)
          .pipe(
            distinctUntilKeyChangedLoose("id") // Do not emit anything if this is exactly the same lieu dit
          ),
        this.getCoordinatesSystem$()
          .pipe(
            distinctUntilChanged()
          )
      ])
      .pipe(
        map(this.getCoordinatesOfLieuDit),
        takeUntil(this.destroy$)
      );
  };

  private updateAreCoordinatesCustomized = (): void => {
    combineLatest([
      this.controlGroup.controls.altitude.valueChanges.pipe<number>(
        distinctUntilChanged()
      ),
      this.controlGroup.controls.longitude.valueChanges.pipe<number>(
        distinctUntilChanged()
      ),
      this.controlGroup.controls.latitude.valueChanges.pipe<number>(
        distinctUntilChanged()
      )]
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(([altitude, longitude, latitude]) => {

        if (altitude != null && longitude != null && latitude != null) {
          const lieudit: string | LieuDit = this.controlGroup.controls.lieudit.value;

          if ((lieudit as LieuDit)?.id) {
            const inventaireCoordinates: Coordinates = {
              longitude,
              latitude,
              system: this.coordinatesService.getCoordinatesSystemType()
            };

            const lieuDitCoordinates = {
              system: (lieudit as LieuDit)?.coordinatesSystem,
              longitude: (lieudit as LieuDit)?.longitude,
              latitude: (lieudit as LieuDit)?.latitude
            }

            if (
              altitude !== (lieudit as LieuDit).altitude ||
              !areSameCoordinates(lieuDitCoordinates, inventaireCoordinates)
            ) {
              this.areCoordinatesCustomized$.next(true);
              return;
            }
          }
        }

        this.areCoordinatesCustomized$.next(false);
      });
  };

  private displayCoordinates = (coordinates: {
    altitude: number,
    longitude: number,
    latitude: number,
    areTransformed: boolean,
    areInvalid: boolean
  }
  ): void => {
    if (!coordinates.areInvalid && this.controlGroup.contains("altitude")) {
      this.controlGroup.controls.altitude.setValue(coordinates.altitude);
      this.controlGroup.controls.longitude.setValue(coordinates.longitude);
      this.controlGroup.controls.latitude.setValue(coordinates.latitude);
    }
    this.coordinatesService.setAreCoordinatesTransformed(coordinates.areTransformed);
    this.coordinatesService.setAreCoordinatesInvalid(coordinates.areInvalid);
  };

  private updateCoordinatesControls = (
    lieuditGroup: FormGroup,
    areInvalid: boolean
  ): void => {
    if (areInvalid && lieuditGroup.contains("altitude")) {
      lieuditGroup.removeControl("altitude");
      lieuditGroup.removeControl("longitude");
      lieuditGroup.removeControl("latitude");
    } else if (!lieuditGroup.contains("altitude")) {
      const altitudeControl = new FormControl("", [
        Validators.required,
        this.altitudeValidator()
      ]);
      const longitudeControl = new FormControl();
      const latitudeControl = new FormControl();
      lieuditGroup.addControl("altitude", altitudeControl);
      lieuditGroup.addControl("longitude", longitudeControl);
      lieuditGroup.addControl("latitude", latitudeControl);
    }
  };

  public getCoordinatesSystem$ = (): Observable<CoordinatesSystem> => {
    return this.coordinatesService.getCoordinatesSystem$();
  };

  public getAreCoordinatesInvalid$ = (): Observable<boolean> => {
    return this.coordinatesService.getAreCoordinatesInvalid$();
  };

  public getAreCoordinatesTransformed$ = (): Observable<boolean> => {
    return this.coordinatesService.getAreCoordinatesTransformed$();
  };

  public displayCommuneFormat = (commune: Commune): string => {
    return commune ? `${commune.code} - ${commune.nom}` : "";
  };

  public displayDepartementFormat = (departement: Departement): string => {
    return departement?.code ?? null;
  };

  public displayLieuDitFormat = (lieudit: LieuDit): string => {
    return lieudit?.nom ?? null;
  };

  /**
   * The altitude should be filled and should be an integer
   */
  private altitudeValidator = (): ValidatorFn => {
    return FormValidatorHelper.isAnIntegerValidator(0, 65535);
  };

  public onSearchInMapClicked = (): void => {
    this.searchInMapClick?.emit();
  }

}
