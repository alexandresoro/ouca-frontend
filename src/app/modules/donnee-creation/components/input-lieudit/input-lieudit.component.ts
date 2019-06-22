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
    const departementControl = this.controlGroup.get("departement");
    const communeControl = this.controlGroup.get("commune");
    const lieuDitControl = this.controlGroup.get("lieudit");

    departementControl.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((selectedDepartement: Departement) => {
        this.resetCommunes();
      });

    communeControl.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((selectedCommune: Commune) => {
        this.resetLieuxDits();
      });

    lieuDitControl.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((selectedLieuDit: Lieudit) => {
        this.updateCoordinates(selectedLieuDit);
      });

    this.filteredCommunes$ = combineLatest(
      departementControl.valueChanges as Observable<Departement>,
      this.communes,
      (selectedDepartement, communes) => {
        return communes && selectedDepartement && selectedDepartement.id
          ? communes.filter((commune) => {
              return commune.departementId === selectedDepartement.id;
            })
          : [];
      }
    );

    this.filteredLieuxdits$ = combineLatest(
      communeControl.valueChanges as Observable<Commune>,
      this.lieuxdits,
      (selectedCommune, lieuxdits) => {
        return lieuxdits && selectedCommune && selectedCommune.id
          ? lieuxdits.filter((lieudit) => {
              return lieudit.communeId === selectedCommune.id;
            })
          : [];
      }
    );
  }

  /**
   * When selecting a departement, filter the list of communes
   */
  public resetCommunes(): void {
    this.controlGroup.controls.commune.setValue(null);
  }

  /**
   * When selecting a commune, filter the list of lieux-dits and reset coordinates
   */
  public resetLieuxDits(): void {
    this.controlGroup.controls.lieudit.setValue(null);
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
    return !!commune ? commune.code + " - " + commune.nom : "";
  }

  public displayDepartementFormat = (departement: Departement): string => {
    return !!departement ? departement.code : null;
  }

  public displayLieuDitFormat = (lieuDit: Lieudit): string => {
    return !!lieuDit ? lieuDit.nom : null;
  }
}
