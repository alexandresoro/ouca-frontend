import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Commune } from "ouca-common/commune.object";
import {
  CoordinatesSystem,
  COORDINATES_SYSTEMS_CONFIG,
  getCoordinates
} from "ouca-common/coordinates-system";
import { Coordinates } from "ouca-common/coordinates.object";
import { Departement } from "ouca-common/departement.object";
import { Lieudit } from "ouca-common/lieudit.object";
import { combineLatest, Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { CrossFieldErrorMatcher } from "src/app/modules/shared/matchers/cross-field-error.matcher";
import { BackendApiService } from "src/app/services/backend-api.service";
import { CoordinatesService } from "src/app/services/coordinates.service";
import { ListHelper } from "../../../../shared/helpers/list-helper";
import { EntitySubFormComponent } from "../entite-simple-form/entity-sub-form.component";

@Component({
  selector: "lieudit-form",
  styleUrls: ["./lieudit-form.component.scss"],
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

  public coordinatesSystem$: Observable<CoordinatesSystem>;

  public currentCoordinates$: Observable<Coordinates>;

  public lieuditNomErrorStateMatcher = new CrossFieldErrorMatcher(
    "alreadyExistingNom"
  );

  constructor(
    private backendApiService: BackendApiService,
    private coordinatesService: CoordinatesService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initialSetting = true;

    this.coordinatesSystem$ = this.coordinatesService
      .getAppCoordinatesSystem$()
      .pipe(
        map(
          (coordinatesSystemType) =>
            COORDINATES_SYSTEMS_CONFIG[coordinatesSystemType]
        )
      );

    this.currentCoordinates$ = this.coordinatesService
      .getAppCoordinatesSystem$()
      .pipe(
        map((coordinatesSystemType) =>
          getCoordinates(this.entity, coordinatesSystemType)
        )
      );

    this.currentCoordinates$.subscribe((coordinates) => {
      this.entityForm.controls.longitude.setValue(coordinates?.longitude);
      this.entityForm.controls.latitude.setValue(coordinates?.latitude);
    });

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
  }

  public resetSelectedCommune = (): void => {
    this.entityForm.controls.communeId.setValue(null);
    this.nomCommuneControl.setValue(null);
  };
}
