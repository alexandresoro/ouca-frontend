import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Commune } from "basenaturaliste-model/commune.object";
import { Departement } from "basenaturaliste-model/departement.object";
import { Lieudit } from "basenaturaliste-model/lieudit.object";
import { combineLatest, Observable } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";
import { AutocompleteAttribute } from "../../../shared/components/autocomplete/autocomplete-attribute.object";

@Component({
  selector: "input-lieudit",
  templateUrl: "./input-lieudit.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputLieuditComponent implements OnInit {
  @Input() public departements: Observable<Departement[]>;

  @Input() public communes: Observable<Commune[]>;

  @Input() public lieuxdits: Observable<Lieudit[]>;

  @Input() public controlGroup: FormGroup;

  @Input() public hideCoordinates: boolean = false;

  @Input() public isMultipleSelectMode?: boolean;

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
      (selection, communes) => {
        if (communes) {
          if (selection) {
            if (this.isMultipleSelectMode) {
              return communes.filter((commune) => {
                return (
                  selection.indexOf(commune.departementId) > -1 ||
                  selection.indexOf(commune.departement.id) > -1
                );
              });
            } else {
              return communes.filter((commune) => {
                return (
                  commune.departementId === selection.id ||
                  (commune.departement &&
                    commune.departement.id === selection.id)
                );
              });
            }
          } else {
            return communes;
          }
        } else {
          return [];
        }
      }
    );

    this.filteredLieuxdits$ = combineLatest(
      communeControl.valueChanges,
      this.lieuxdits,
      (selection, lieuxdits) => {
        if (lieuxdits) {
          if (selection) {
            if (this.isMultipleSelectMode) {
              return lieuxdits.filter((lieudit) => {
                return (
                  selection.indexOf(lieudit.communeId) > -1 ||
                  selection.indexOf(lieudit.commune.id) > -1
                );
              });
            } else {
              return lieuxdits.filter((lieudit) => {
                return (
                  lieudit.communeId === selection.id ||
                  (lieudit.commune && lieudit.commune.id === selection.id)
                );
              });
            }
          } else {
            return lieuxdits;
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
  public updateCoordinates(lieuDit: Lieudit): void {
    if (
      !!lieuDit &&
      !!lieuDit.altitude &&
      !!lieuDit.longitude &&
      !!lieuDit.latitude
    ) {
      this.setSelectedCoordinates(
        lieuDit.altitude,
        lieuDit.longitude,
        lieuDit.latitude
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

  public displayLieuDitFormat = (lieuDit: Lieudit): string => {
    return lieuDit ? lieuDit.nom : null;
  };
}
