import { Component } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { Response } from "@angular/http";
import { Commune } from "basenaturaliste-model/commune.object";
import { Departement } from "basenaturaliste-model/departement.object";
import { combineLatest, Observable, Subject } from "rxjs";
import { BackendApiService } from "../../../../shared/services/backend-api.service";
import { EntitySubFormComponent } from "../entite-simple-form/entity-sub-form.component";

@Component({
  selector: "lieudit-form",
  templateUrl: "./lieudit-form.tpl.html"
})
export class LieuditFormComponent extends EntitySubFormComponent {
  public departements$: Subject<Departement[]>;

  private communes$: Subject<Commune[]>;

  public filteredCommunes$: Observable<Commune[]>;

  public selectedDepartement: Departement;

  public departementControl: FormControl;

  public nomCommuneControl: FormControl;

  constructor(private backendApiService: BackendApiService) {
    super();
  }

  ngOnInit(): void {
    this.departementControl = new FormControl("", [Validators.required]);
    this.nomCommuneControl = new FormControl("", [Validators.required]);

    this.departements$ = new Subject();
    this.communes$ = new Subject();

    this.departementControl.valueChanges.subscribe(
      (selectedDepartement: Departement) => {
        this.resetSelectedCommune();
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

    // Get all departements
    this.backendApiService.getAllEntities("departement").subscribe(
      (result: Departement[]) => {
        this.departements$.next(!!result ? result : []);
      },
      (error: Response) => {
        console.error("Impossible de trouver les départements (" + error + ")");
      }
    );

    // Get all communes
    this.backendApiService.getAllEntities("commune").subscribe(
      (result: Commune[]) => {
        this.communes$.next(!!result ? result : []);
      },
      (error: Response) => {
        console.error("Impossible de trouver les communes (" + error + ")");
      }
    );
  }

  public resetSelectedCommune(): void {
    this.entityForm.controls.commune.setValue(null);
    this.nomCommuneControl.setValue(null);
  }
}
