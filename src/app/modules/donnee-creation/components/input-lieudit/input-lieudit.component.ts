import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit
} from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from "@angular/forms";
import * as _ from "lodash";
import {
  BehaviorSubject,
  combineLatest,
  merge,
  Observable,
  ReplaySubject,
  Subject
} from "rxjs";
import { distinctUntilChanged, filter, takeUntil } from "rxjs/operators";
import { areSameCoordinates, getCoordinates } from 'src/app/model/coordinates-system/coordinates-helper';
import { CoordinatesSystem } from 'src/app/model/coordinates-system/coordinates-system.object';
import { Commune } from 'src/app/model/types/commune.model';
import { Coordinates } from 'src/app/model/types/coordinates.object';
import { Departement } from 'src/app/model/types/departement.object';
import { Lieudit } from 'src/app/model/types/lieudit.model';
import { UICommune } from "src/app/models/commune.model";
import { UILieudit } from "src/app/models/lieudit.model";
import { FormValidatorHelper } from "src/app/modules/shared/helpers/form-validator.helper";
import { CoordinatesService } from "src/app/services/coordinates.service";
import { EntitiesStoreService } from "src/app/services/entities-store.service";
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

  private readonly destroy$ = new Subject();

  private departementDefault$: ReplaySubject<Departement> = new ReplaySubject<
    Departement
  >(1);

  private communeDefault$: ReplaySubject<Departement> = new ReplaySubject<
    Departement
  >(1);

  public departements$: Observable<Departement[]>;

  public filteredLieuxdits$: Observable<UILieudit[]>;

  public filteredCommunes$: Observable<UICommune[]>;

  public areCoordinatesCustomized$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

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

  constructor(
    private coordinatesService: CoordinatesService,
    private entitiesStoreService: EntitiesStoreService
  ) {
    this.departements$ = this.entitiesStoreService.getDepartements$();
  }

  public ngOnInit(): void {
    const departementControl = this.isMultipleSelectMode
      ? this.controlGroup.get("departements")
      : this.controlGroup.get("departement");
    const communeControl = this.isMultipleSelectMode
      ? this.controlGroup.get("communes")
      : this.controlGroup.get("commune");
    const lieuditControl = this.isMultipleSelectMode
      ? this.controlGroup.get("lieuxdits")
      : this.controlGroup.get("lieudit");

    if (departementControl?.value?.id) {
      this.departementDefault$.next(departementControl.value);
      this.departementDefault$.complete();
    }

    if (communeControl?.value?.id) {
      this.communeDefault$.next(communeControl.value);
      this.communeDefault$.complete();
    }

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
          this.displayCoordinates(null, null, null, false, false);
        }
      });

    this.filteredCommunes$ = this.getCommunesToDisplay$(departementControl);

    this.filteredLieuxdits$ = this.getLieuxditsToDisplay$(communeControl);

    if (!this.isMultipleSelectMode) {
      this.getCoordinatesToDisplay$(lieuditControl).subscribe((coordinates) => {
        this.displayCoordinates(
          coordinates.altitude,
          coordinates.longitude,
          coordinates.latitude,
          coordinates.areTransformed,
          coordinates.areInvalid
        );
      });
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

  private getCommunesToDisplay$ = (
    departementControl: AbstractControl
  ): Observable<UICommune[]> => {
    return combineLatest(
      merge(departementControl.valueChanges, this.departementDefault$),
      this.entitiesStoreService.getCommunes$(),
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
      this.entitiesStoreService.getLieuxdits$(),
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
      lieuditControl.valueChanges.pipe(
        filter(() => {
          return lieuditControl.dirty;
        }),
        distinctUntilChanged()
      ),
      this.getCoordinatesSystem$().pipe(distinctUntilChanged()),
      (selectedLieudit: Lieudit, coordinatesSystem: CoordinatesSystem) => {
        if (!!selectedLieudit?.id && !!coordinatesSystem?.code) {
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
      }
    ).pipe(takeUntil(this.destroy$));
  };

  private updateAreCoordinatesCustomized = (): void => {
    combineLatest(
      this.controlGroup.controls.altitude.valueChanges.pipe(
        distinctUntilChanged()
      ),
      this.controlGroup.controls.longitude.valueChanges.pipe(
        distinctUntilChanged()
      ),
      this.controlGroup.controls.latitude.valueChanges.pipe(
        distinctUntilChanged()
      )
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(([altitude, longitude, latitude]) => {
        this.areCoordinatesCustomized$.next(false);

        if (!_.isNil(altitude) && !_.isNil(longitude) && !_.isNil(latitude)) {
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
            }
          }
        }
      });
  };

  private displayCoordinates = (
    altitude: number,
    longitude: number,
    latitude: number,
    areTransformed: boolean,
    areInvalid: boolean
  ): void => {
    if (!this.hideCoordinates) {
      if (!areInvalid && this.controlGroup.contains("altitude")) {
        this.controlGroup.controls.altitude.setValue(altitude);
        this.controlGroup.controls.longitude.setValue(longitude);
        this.controlGroup.controls.latitude.setValue(latitude);
      }
      this.coordinatesService.setAreCoordinatesTransformed(!!areTransformed);
      this.coordinatesService.setAreCoordinatesInvalid(!!areInvalid);
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
}
