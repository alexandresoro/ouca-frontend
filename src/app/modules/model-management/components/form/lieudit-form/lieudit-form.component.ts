import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Commune } from "ouca-common/commune.object";
import {
  CoordinatesSystemType,
  COORDINATES_SYSTEMS_CONFIG,
  getOriginCoordinates
} from "ouca-common/coordinates-system";
import { Coordinates } from "ouca-common/coordinates.object";
import { Departement } from "ouca-common/departement.object";
import { Lieudit } from "ouca-common/lieudit.object";
import { combineLatest, Observable, Subject } from "rxjs";
import { CrossFieldErrorMatcher } from "src/app/modules/shared/matchers/cross-field-error.matcher";
import { ListHelper } from "../../../../shared/helpers/list-helper";
import { BackendApiService } from "../../../../shared/services/backend-api.service";
import { EntitySubFormComponent } from "../entite-simple-form/entity-sub-form.component";

@Component({
  selector: "lieudit-form",
  templateUrl: "./lieudit-form.component.html"
})
export class LieuditFormComponent extends EntitySubFormComponent<Lieudit>
  implements OnInit {
  public departements$: Subject<Departement[]>;

  private communes$: Subject<Commune[]>;

  public filteredCommunes$: Observable<Commune[]>;

  public selectedDepartement: Departement;

  public departementControl: FormControl;

  public nomCommuneControl: FormControl;

  public coordinatesFormGroup: FormGroup;

  private initialSetting: boolean;

  private coordinatesSystem: CoordinatesSystemType;

  public lieuditNomErrorStateMatcher = new CrossFieldErrorMatcher(
    "alreadyExistingNom"
  );

  constructor(private backendApiService: BackendApiService) {
    super();
  }

  ngOnInit(): void {
    this.initialSetting = true;

    const coordinates: Coordinates = getOriginCoordinates(this.entity);
    this.coordinatesSystem = coordinates.system;

    this.departementControl = new FormControl("", [Validators.required]);
    this.nomCommuneControl = new FormControl("", [Validators.required]);

    this.departements$ = new Subject();
    this.communes$ = new Subject();

    this.departementControl.valueChanges.subscribe(() => {
      if (!this.initialSetting) {
        this.resetSelectedCommune();
      } else {
        this.initialSetting = false;
      }
    });

    this.filteredCommunes$ = combineLatest(
      this.departementControl.valueChanges as Observable<Departement>,
      this.communes$,
      (selectedDepartement, communes) => {
        return communes && selectedDepartement && selectedDepartement.id
          ? communes.filter((commune) => {
              return (
                commune.departement &&
                commune.departement.id === selectedDepartement.id
              );
            })
          : [];
      }
    );

    combineLatest(
      this.backendApiService.getAllEntities("departement") as Observable<
        Departement[]
      >,
      this.backendApiService.getAllEntities("commune") as Observable<Commune[]>
    ).subscribe(
      (result: [Departement[], Commune[]]) => {
        this.departements$.next(result[0] ? result[0] : []);
        this.communes$.next(result[1] ? result[1] : []);

        if (this.entityForm.controls.commune.value) {
          this.departementControl.setValue(
            ListHelper.findEntityInListByID(
              result[0],
              this.entityForm.controls.commune.value.departement.id
            )
          );

          this.entityForm.controls.communeId.setValue(
            this.entityForm.controls.commune.value.id
          );
        }
      },
      (error: HttpErrorResponse) => {
        console.error(
          "Impossible de trouver les communes ou departements (" + error + ")"
        );
      }
    );

    this.entityForm.controls.communeId.valueChanges.subscribe(
      (selectedCommuneId: number) => {
        this.nomCommuneControl.setValue(selectedCommuneId, {
          emitEvent: false
        });
      }
    );
    this.nomCommuneControl.valueChanges.subscribe(
      (selectedCommuneId: number) => {
        this.entityForm.controls.communeId.setValue(selectedCommuneId, {
          emitEvent: false
        });
      }
    );

    this.entityForm.controls.longitude.setValue(coordinates.longitude);
    this.entityForm.controls.latitude.setValue(coordinates.latitude);
  }

  public resetSelectedCommune = (): void => {
    this.entityForm.controls.communeId.setValue(null);
    this.nomCommuneControl.setValue(null);
  };

  public getMinimumLatitude = (): number => {
    return COORDINATES_SYSTEMS_CONFIG[this.coordinatesSystem].latitudeRange.min;
  };

  public getMaximumLatitude = (): number => {
    return COORDINATES_SYSTEMS_CONFIG[this.coordinatesSystem].latitudeRange.max;
  };

  public getMinimumLongitude = (): number => {
    return COORDINATES_SYSTEMS_CONFIG[this.coordinatesSystem].longitudeRange
      .min;
  };

  public getMaximumLongitude = (): number => {
    return COORDINATES_SYSTEMS_CONFIG[this.coordinatesSystem].longitudeRange
      .max;
  };

  public getUnitName = (): string => {
    return COORDINATES_SYSTEMS_CONFIG[this.coordinatesSystem].unitName;
  };
}
