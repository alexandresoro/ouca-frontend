import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Commune } from "ouca-common/commune.object";
import { CoordinatesSystem } from "ouca-common/coordinates-system";
import { Departement } from "ouca-common/departement.object";
import { Lieudit } from "ouca-common/lieudit.object";
import { combineLatest, Observable } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";
import { getOriginCoordinates } from "src/app/modules/shared/helpers/coordinates.helper";
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

  public ngOnInit(): void {
    const departementControl = this.isMultipleSelectMode
      ? this.controlGroup.get("departements")
      : this.controlGroup.get("departement");
    const communeControl = this.isMultipleSelectMode
      ? this.controlGroup.get("communes")
      : this.controlGroup.get("commune");
    const lieuDitControl = this.isMultipleSelectMode
      ? this.controlGroup.get("lieuxdits")
      : this.controlGroup.get("lieudit");

    departementControl.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(() => {
        this.resetCommunes();
      });

    communeControl.valueChanges.pipe(distinctUntilChanged()).subscribe(() => {
      this.resetLieuxDits();
    });

    lieuDitControl.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((selectedLieuDit: Lieudit) => {
        if (!this.hideCoordinates) {
          this.updateCoordinates(selectedLieuDit);
        }
      });

    this.filteredCommunes$ = combineLatest(
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

    this.filteredLieuxdits$ = combineLatest(
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
  }

  /**
   * When selecting a departement, filter the list of communes
   */
  public resetCommunes(): void {
    this.isMultipleSelectMode
      ? this.controlGroup.controls.communes.setValue(null)
      : this.controlGroup.controls.commune.setValue(null);
  }

  /**
   * When selecting a commune, filter the list of lieux-dits and reset coordinates
   */
  public resetLieuxDits(): void {
    this.isMultipleSelectMode
      ? this.controlGroup.controls.lieuxdits.setValue(null)
      : this.controlGroup.controls.lieudit.setValue(null);
  }

  /**
   * When selecting a lieu-dit, update coordinates
   */
  public updateCoordinates(lieudit: Lieudit): void {
    if (lieudit && lieudit.id) {
      const coordinates = getOriginCoordinates(lieudit);
      this.setSelectedCoordinates(
        lieudit.altitude,
        coordinates.longitude,
        coordinates.latitude
      );
    } else {
      this.setSelectedCoordinates(null, null, null);
    }
  }

  private setSelectedCoordinates(
    altitude: number,
    longitude: number,
    latitude: number
  ): void {
    this.controlGroup.controls.altitude.setValue(altitude);
    this.controlGroup.controls.longitude.setValue(longitude);
    this.controlGroup.controls.latitude.setValue(latitude);
  }

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
