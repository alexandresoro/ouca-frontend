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
import L from 'leaflet';
import {
  BehaviorSubject,
  combineLatest,
  iif,
  merge,
  Observable,
  of,
  ReplaySubject,
  Subject
} from "rxjs";
import { delay, distinctUntilChanged, filter, map, switchMap, takeUntil, withLatestFrom } from "rxjs/operators";
import { areSameCoordinates, getCoordinates } from 'src/app/model/coordinates-system/coordinates-helper';
import { COORDINATES_SYSTEMS_CONFIG } from 'src/app/model/coordinates-system/coordinates-system-list.object';
import { CoordinatesSystem } from 'src/app/model/coordinates-system/coordinates-system.object';
import { findCommuneById } from 'src/app/model/helpers/commune.helper';
import { findDepartementById } from 'src/app/model/helpers/departement.helper';
import { Commune } from 'src/app/model/types/commune.model';
import { Coordinates } from 'src/app/model/types/coordinates.object';
import { Departement } from 'src/app/model/types/departement.object';
import { EntiteSimple } from 'src/app/model/types/entite-simple.object';
import { Lieudit } from 'src/app/model/types/lieudit.model';
import { UICommune } from "src/app/models/commune.model";
import { UILieudit } from "src/app/models/lieudit.model";
import { getAllLieuxDitsCoordinatesOfCommune, getAllLieuxDitsCoordinatesOfDepartement } from 'src/app/modules/shared/helpers/coordinates-helper';
import { FormValidatorHelper } from "src/app/modules/shared/helpers/form-validator.helper";
import { distinctUntilKeyChangedLoose } from 'src/app/modules/shared/rx-operators';
import { AppConfigurationService } from 'src/app/services/app-configuration.service';
import { CoordinatesService } from "src/app/services/coordinates.service";
import { CreationMapService } from 'src/app/services/creation-map.service';
import { CreationModeService } from 'src/app/services/creation-mode.service';
import { EntitiesStoreService } from "src/app/services/entities-store.service";
import { IgnAlticodageService } from 'src/app/services/ign-alticodage.service';
import { AutocompleteAttribute } from "../../../shared/components/autocomplete/autocomplete-attribute.object";

@Component({
  selector: "input-lieudit",
  styleUrls: ["input-lieudit.component.scss"],
  templateUrl: "./input-lieudit.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputLieuditComponent implements OnInit, OnDestroy {
  @Input() public controlGroup: FormGroup;

  @Input() public hideCoordinates?: boolean = false;

  @Input() public isMultipleSelectMode?: boolean;

  @Output() public searchInMapClick: EventEmitter<void> = new EventEmitter<void>();

  private readonly destroy$ = new Subject();

  private departementDefault$: ReplaySubject<Departement> = new ReplaySubject<
    Departement
  >(1);

  private communeDefault$: ReplaySubject<Departement> = new ReplaySubject<
    Departement
  >(1);

  public departements$: Observable<Departement[]>;

  public allCommunes$: Observable<UICommune[]>;

  public allLieuxDits$: Observable<UILieudit[]>;

  public filteredLieuxdits$: Observable<UILieudit[]>;

  public filteredCommunes$: Observable<UICommune[]>;

  public areCoordinatesCustomized$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);
  public isCurrentSystemGps$: Observable<boolean>;

  public isSearchInMapButtonDisabled$: Observable<boolean>;

  public departementAutocompleteAttributes: AutocompleteAttribute[] = [
    {
      key: "code",
      exactSearchMode: true,
      startWithMode: true
    }
  ];
  public communeAutocompleteAttributes: AutocompleteAttribute[] = [
    {
      key: "code",
      exactSearchMode: true,
      startWithMode: true
    },
    {
      key: "nom",
      exactSearchMode: false,
      startWithMode: true
    }
  ];

  public lieuditAutocompleteAttributes: AutocompleteAttribute[] = [
    {
      key: "nom",
      exactSearchMode: false,
      startWithMode: false
    }
  ];

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
    private coordinatesService: CoordinatesService,
    private entitiesStoreService: EntitiesStoreService,
    private appConfigurationService: AppConfigurationService,
    private creationModeService: CreationModeService,
    private creationMapService: CreationMapService,
    private ignAlticodageService: IgnAlticodageService
  ) {
    this.departements$ = this.entitiesStoreService.getDepartements$();
    this.allCommunes$ = this.entitiesStoreService.getCommunes$();
    this.allLieuxDits$ = this.entitiesStoreService.getLieuxdits$();
  }

  public ngOnInit(): void {
    const departementControl = this.isMultipleSelectMode
      ? this.controlGroup.get("departements")
      : this.controlGroup.get("departement");
    const communeControl = this.isMultipleSelectMode
      ? this.controlGroup.get("communes")
      : this.controlGroup.get("commune");
    const lieuditControl: FormControl = this.isMultipleSelectMode
      ? (this.controlGroup.get("lieuxdits") as FormControl)
      : (this.controlGroup.get("lieudit") as FormControl);

    if (departementControl?.value?.id) {
      this.departementDefault$.next(departementControl.value);
      this.departementDefault$.complete();
    }

    if (communeControl?.value?.id) {
      this.communeDefault$.next(communeControl.value);
      this.communeDefault$.complete();
    }

    departementControl.valueChanges.subscribe((value) => {
      value?.id && this.focusOnDepartementEvent$.next(value.id);
    });

    departementControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        filter((newValue) => {
          const currentValue: Departement = departementControl.value;
          // Reset except if the selection remains a departement with the same id
          return (
            !currentValue?.id ||
            !newValue?.id ||
            currentValue.id !== newValue.id
          );
        })
      )
      .subscribe(() => {
        communeControl.setValue(null);
      });

    communeControl.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((newValue: UICommune) => {
        const currentValue: UICommune = communeControl.value;
        // Reset except if the selection remains a commune with the same id
        if (
          !currentValue?.id ||
          !newValue?.id ||
          currentValue.id !== newValue.id
        ) {
          lieuditControl.setValue(null);
        }
      });

    this.filteredCommunes$ = this.getCommunesToDisplay$(departementControl);

    this.filteredLieuxdits$ = this.getLieuxditsToDisplay$(communeControl);

    this.isCurrentSystemGps$ = this.appConfigurationService.getAppCoordinatesSystem$().pipe(map(systemType => systemType === COORDINATES_SYSTEMS_CONFIG.gps));

    this.isSearchInMapButtonDisabled$ = this.creationModeService.getIsInventaireEnabled$().pipe((map(isInventaireEnabled => !isInventaireEnabled)));

    if (!this.isMultipleSelectMode) {

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
          withLatestFrom(
            this.allLieuxDits$,
            this.allCommunes$,
            this.departements$
          ),
          takeUntil(this.destroy$)
        )
        .subscribe(([lieuDitFromUI, lieuxdits, communes, departements]) => {
          if (lieuDitFromUI && lieuDitFromUI !== (lieuditControl.value as UILieudit)?.id) {
            const lieuDitToSet = lieuxdits.find((lieudit) => {
              return lieudit.id === lieuDitFromUI;
            });

            const communeToSet = findCommuneById(communes, lieuDitToSet.commune?.id);
            const departementToSet = findDepartementById(departements, communeToSet?.departement?.id);

            departementControl.markAsPristine();
            departementControl.setValue(departementToSet);

            communeControl.markAsPristine();
            communeControl.setValue(communeToSet);

            lieuditControl.markAsPristine();

            lieuditControl.setValue(lieuDitToSet);
          }
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
        .subscribe((lieuDit) => {
          lieuDit?.coordinates && this.creationMapService.setCoordinatesToFocus([[lieuDit.coordinates.latitude, lieuDit.coordinates.longitude]]);
        });

      // Focus on the commune if no lieu dit is selected
      this.focusOnCommuneEvent$
        .pipe(
          withLatestFrom(this.allLieuxDits$),
          takeUntil(this.destroy$)
        )
        .subscribe(([communeId, allLieuxDits]) => {
          if (communeId) {
            const currentLieuDitId = this.controlGroup.controls?.lieudit?.value?.id;
            if (!currentLieuDitId) {
              this.creationMapService.setCoordinatesToFocus(getAllLieuxDitsCoordinatesOfCommune(allLieuxDits, communeId));
            }
          }
        });

      // Focus should be on the departement if no commune is selected
      this.focusOnDepartementEvent$
        .pipe(
          withLatestFrom(this.allLieuxDits$),
          takeUntil(this.destroy$)
        )
        .subscribe(([departementId, allLieuxDits]) => {
          if (departementId) {
            const currentCommuneId = this.controlGroup.controls?.commune?.value?.id;
            if (!currentCommuneId) {
              this.creationMapService.setCoordinatesToFocus(getAllLieuxDitsCoordinatesOfDepartement(allLieuxDits, departementId));
            }
          }
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

  public onDepartementControlActivated = (departement: EntiteSimple): void => {
    this.focusOnDepartementEvent$.next(departement?.id);
  }

  public onCommuneControlFocused = (): void => {
    this.focusOnCommuneEvent$.next(this.controlGroup.controls?.commune?.value?.id);
  }

  public onCommuneControlActivated = (commune: EntiteSimple): void => {
    this.focusOnCommuneEvent$.next(commune?.id);
  }

  private focusOnLieuDit = (lieuDit: Lieudit | UILieudit): void => {
    lieuDit?.id && this.creationMapService.setFocusedLieuDitId(lieuDit?.id);
    lieuDit?.coordinates && this.creationMapService.setCoordinatesToFocus([[lieuDit.coordinates.latitude, lieuDit.coordinates.longitude]]);
  }

  public onLieuDitControlFocused = (): void => {
    const currentLieuDitId = this.controlGroup.controls?.lieudit?.value;
    this.focusOnLieuDit(currentLieuDitId);
  }

  public onLieuDitActivated = (lieuDit: Lieudit | UILieudit): void => {
    this.focusOnLieuDit(lieuDit);
  }
  public getCoordinatesInputStep = (coordinatesSystem: CoordinatesSystem): number => {
    return coordinatesSystem?.decimalPlaces ? Math.pow(10, -coordinatesSystem.decimalPlaces) : 1;
  }

  private getCommunesToDisplay$ = (
    departementControl: AbstractControl
  ): Observable<UICommune[]> => {
    return combineLatest(
      merge(departementControl.valueChanges, this.departementDefault$),
      this.allCommunes$,
      (selection: string | number[] | Departement, communes) => {
        if (communes && selection) {
          if (this.isMultipleSelectMode) {
            return communes.filter((commune) => {
              return (selection as number[]).includes(commune?.departement.id);
            });
          } else {
            return communes.filter((commune) => {
              return commune.departement?.id === (selection as Departement).id;
            });
          }
        } else {
          return [];
        }
      }
    ).pipe(takeUntil(this.destroy$));
  };

  private getLieuxditsToDisplay$ = (
    communeControl: AbstractControl
  ): Observable<UILieudit[]> => {
    return combineLatest(
      merge(communeControl.valueChanges, this.communeDefault$),
      this.allLieuxDits$,
      (selection: string | number[] | Commune, lieuxdits) => {
        if (lieuxdits && selection) {
          if (this.isMultipleSelectMode) {
            return lieuxdits.filter((lieudit) => {
              return (selection as number[]).includes(lieudit.commune.id);
            });
          } else {
            return lieuxdits.filter((lieudit) => {
              return lieudit.commune?.id === (selection as Commune).id;
            });
          }
        } else {
          return [];
        }
      }
    ).pipe(takeUntil(this.destroy$));
  };

  private getCoordinatesOfLieuDit = ([selectedLieudit, coordinatesSystem]: [Lieudit, CoordinatesSystem]): {
    altitude: number;
    longitude: number;
    latitude: number;
    areTransformed: boolean;
    areInvalid: boolean;
  } => {
    if (selectedLieudit?.id && coordinatesSystem?.code) {
      const coordinates = getCoordinates(
        selectedLieudit,
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
        (lieuditControl.valueChanges as Observable<Lieudit>)
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
          const lieudit = this.controlGroup.controls.lieudit.value;
          if (lieudit?.id) {
            const inventaireCoordinates: Coordinates = {
              longitude,
              latitude,
              system: this.coordinatesService.getCoordinatesSystemType()
            };

            if (
              altitude !== lieudit.altitude ||
              !areSameCoordinates(lieudit.coordinates, inventaireCoordinates)
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
    if (!this.hideCoordinates) {
      if (!coordinates.areInvalid && this.controlGroup.contains("altitude")) {
        this.controlGroup.controls.altitude.setValue(coordinates.altitude);
        this.controlGroup.controls.longitude.setValue(coordinates.longitude);
        this.controlGroup.controls.latitude.setValue(coordinates.latitude);
      }
      this.coordinatesService.setAreCoordinatesTransformed(coordinates.areTransformed);
      this.coordinatesService.setAreCoordinatesInvalid(coordinates.areInvalid);
    }
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
    return commune ? commune.code + " - " + commune.nom : "";
  };

  public displayDepartementFormat = (departement: Departement): string => {
    return departement ? departement.code : null;
  };

  public displayLieuDitFormat = (lieudit: Lieudit): string => {
    return lieudit ? lieudit.nom : null;
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
