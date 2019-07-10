import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { Commune } from "basenaturaliste-model/commune.object";
import { Departement } from "basenaturaliste-model/departement.object";
import { combineLatest, Observable, Subject } from "rxjs";
import { ListHelper } from "../../../../shared/helpers/list-helper";
import { BackendApiService } from "../../../../shared/services/backend-api.service";
import { EntitySubFormComponent } from "../entite-simple-form/entity-sub-form.component";

@Component({
  selector: "lieudit-form",
  templateUrl: "./lieudit-form.tpl.html"
})
export class LieuditFormComponent extends EntitySubFormComponent
  implements OnInit {
  public departements$: Subject<Departement[]>;

  private communes$: Subject<Commune[]>;

  public filteredCommunes$: Observable<Commune[]>;

  public selectedDepartement: Departement;

  public departementControl: FormControl;

  public nomCommuneControl: FormControl;

  private initialSetting: boolean;

  constructor(private backendApiService: BackendApiService) {
    super();
  }

  ngOnInit(): void {
    this.initialSetting = true;

    this.departementControl = new FormControl("", [Validators.required]);
    this.nomCommuneControl = new FormControl("", [Validators.required]);

    this.departements$ = new Subject();
    this.communes$ = new Subject();

    this.departementControl.valueChanges.subscribe(
      (selectedDepartement: Departement) => {
        if (!this.initialSetting) {
          this.resetSelectedCommune();
        } else {
          this.initialSetting = false;
        }
      }
    );

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
        this.departements$.next(!!result[0] ? result[0] : []);
        this.communes$.next(!!result[1] ? result[1] : []);

        if (this.entityForm.controls.commune.value) {
          this.departementControl.setValue(
            ListHelper.getFromList(
              result[0],
              "id",
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

  public resetSelectedCommune(): void {
    this.entityForm.controls.communeId.setValue(null);
    this.nomCommuneControl.setValue(null);
  }
}
