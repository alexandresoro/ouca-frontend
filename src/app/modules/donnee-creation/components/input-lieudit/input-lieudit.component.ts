import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from "@angular/core";
import { AbstractControl, FormGroup } from "@angular/forms";
import { Commune } from "ouca-common/commune.object";
import {
  CoordinatesSystem,
  CoordinatesSystemType,
  getCoordinates
} from "ouca-common/coordinates-system";
import { Departement } from "ouca-common/departement.object";
import { Lieudit } from "ouca-common/lieudit.object";
import { combineLatest, Observable } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";
import { CoordinatesService } from "src/app/services/coordinates.service";
import { AutocompleteAttribute } from "../../../shared/components/autocomplete/autocomplete-attribute.object";

@Component({
  selector: "input-lieudit",
  templateUrl: "./input-lieudit.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputLieuditComponent implements OnInit {
  @Input() public departements: Observable<Departement[]>;

  @Input() public communes: Observable<Commune[]>;

  @Input() public lieuxdits: Observable<Lieudit[]>;

  @Input() public controlGroup: FormGroup;

  @Input() public hideCoordinates?: boolean = false;

  @Input() public isMultipleSelectMode?: boolean;

  @Input() public coordinatesSystem?: CoordinatesSystem;

  public filteredLieuxdits$: Observable<Lieudit[]>;

  public filteredCommunes$: Observable<Commune[]>;

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

  constructor(private coordinatesService: CoordinatesService) {}

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

    departementControl.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(() => {
        communeControl.setValue(null);
      });

    communeControl.valueChanges.pipe(distinctUntilChanged()).subscribe(() => {
      lieuditControl.setValue(null);
    });

    this.filteredCommunes$ = this.getCommunesToDisplay$(departementControl);

    this.filteredLieuxdits$ = this.getLieuxditsToDisplay$(communeControl);

    this.getCoordinatesToDisplay$(lieuditControl).subscribe((coordinates) => {
      this.displayCoordinates(
        coordinates.altitude,
        coordinates.longitude,
        coordinates.latitude
      );
    });
  }

  private getCommunesToDisplay$ = (
    departementControl: AbstractControl
  ): Observable<Commune[]> => {
    return combineLatest(
      departementControl.valueChanges,
      this.communes,
      (selection: string | number[] | Departement, communes) => {
        if (communes && selection) {
          if (this.isMultipleSelectMode) {
            return communes.filter((commune) => {
              return (
                (selection as number[]).includes(commune.departementId) ||
                (selection as number[]).includes(commune.departement.id)
              );
            });
          } else {
            return communes.filter((commune) => {
              return (
                commune.departementId === (selection as Departement).id ||
                (commune.departement &&
                  commune.departement.id === (selection as Departement).id)
              );
            });
          }
        } else {
          return [];
        }
      }
    );
  };

  private getLieuxditsToDisplay$ = (
    communeControl: AbstractControl
  ): Observable<Lieudit[]> => {
    return combineLatest(
      communeControl.valueChanges,
      this.lieuxdits,
      (selection: string | number[] | Commune, lieuxdits) => {
        if (lieuxdits && selection) {
          if (this.isMultipleSelectMode) {
            return lieuxdits.filter((lieudit) => {
              return (
                (selection as number[]).includes(lieudit.communeId) ||
                (selection as number[]).includes(lieudit.commune.id)
              );
            });
          } else {
            return lieuxdits.filter((lieudit) => {
              return (
                lieudit.communeId === (selection as Commune).id ||
                (lieudit.commune &&
                  lieudit.commune.id === (selection as Commune).id)
              );
            });
          }
        } else {
          return [];
        }
      }
    );
  };

  private getCoordinatesToDisplay$ = (
    lieuditControl: AbstractControl
  ): Observable<{ altitude: number; longitude: number; latitude: number }> => {
    return combineLatest(
      lieuditControl.valueChanges.pipe(distinctUntilChanged()),
      this.coordinatesService.getAppCoordinatesSystem$(),
      (
        selectedLieudit: Lieudit,
        coordinatesSystemType: CoordinatesSystemType
      ) => {
        if (selectedLieudit?.id && coordinatesSystemType) {
          const coordinates = getCoordinates(
            selectedLieudit,
            coordinatesSystemType
          );
          return {
            altitude: selectedLieudit.altitude,
            longitude: coordinates.longitude,
            latitude: coordinates.latitude
          };
        }
        return {
          altitude: null,
          longitude: null,
          latitude: null
        };
      }
    );
  };

  private displayCoordinates = (
    altitude: number,
    longitude: number,
    latitude: number
  ): void => {
    if (!this.hideCoordinates) {
      this.controlGroup.controls.altitude.setValue(altitude);
      this.controlGroup.controls.longitude.setValue(longitude);
      this.controlGroup.controls.latitude.setValue(latitude);
    }
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
}
