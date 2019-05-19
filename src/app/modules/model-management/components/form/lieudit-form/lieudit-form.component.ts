import { Component } from "@angular/core";
import { FormGroup } from "@angular/forms";
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

  constructor(private backendApiService: BackendApiService) {
    super();
  }

  ngOnInit(): void {
    const departementControl = (this.entityForm.controls.commune as FormGroup)
      .controls.departement;
    departementControl.valueChanges.subscribe(
      (selectedDepartement: Departement) => {
        console.log("ici1", selectedDepartement);
        this.resetCommunes();
      }
    );

    this.filteredCommunes$ = combineLatest(
      departementControl.valueChanges as Observable<Departement>,
      this.communes$,
      (selectedDepartement, communes) => {
        console.log("ici2", selectedDepartement);
        return communes && selectedDepartement && selectedDepartement.id
          ? communes.filter((commune) => {
              return commune.departementId === selectedDepartement.id;
            })
          : [];
      }
    );

    this.departements$ = new Subject();
    this.communes$ = new Subject();

    // Get all departements
    this.backendApiService.getAllEntities("departement").subscribe(
      (result: Departement[]) => {
        this.departements$.next(!!result ? result : []);
        console.log(this.departements$);
      },
      (error: Response) => {
        console.error("Impossible de trouver les départements (" + error + ")");
      }
    );

    // Get all communes
    this.backendApiService.getAllEntities("commune").subscribe(
      (result: Commune[]) => {
        this.communes$.next(!!result ? result : []);
        console.log(this.communes$);
      },
      (error: Response) => {
        console.error("Impossible de trouver les communes (" + error + ")");
      }
    );
  }

  public resetCommunes(): void {
    this.entityForm.controls.commune.setValue(null);
  }
}
