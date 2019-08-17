import { HttpErrorResponse } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Age } from "basenaturaliste-model/age.object";
import { Classe } from "basenaturaliste-model/classe.object";
import { Commune } from "basenaturaliste-model/commune.object";
import { Comportement } from "basenaturaliste-model/comportement.object";
import { Departement } from "basenaturaliste-model/departement.object";
import { Espece } from "basenaturaliste-model/espece.object";
import { EstimationDistance } from "basenaturaliste-model/estimation-distance.object";
import { EstimationNombre } from "basenaturaliste-model/estimation-nombre.object";
import { Lieudit } from "basenaturaliste-model/lieudit.object";
import { Meteo } from "basenaturaliste-model/meteo.object";
import { Milieu } from "basenaturaliste-model/milieu.object";
import { Observateur } from "basenaturaliste-model/observateur.object";
import { Sexe } from "basenaturaliste-model/sexe.object";
import { combineLatest, Observable, Subject } from "rxjs";
import {
  getContentTypeFromResponse,
  saveFile
} from "../../../shared/helpers/file-downloader.helper";
import { PageStatusHelper } from "../../../shared/helpers/page-status.helper";
import { BackendApiService } from "../../../shared/services/backend-api.service";

@Component({
  templateUrl: "./view.tpl.html"
})
export class ViewComponent {
  public searchForm: FormGroup = new FormGroup({
    id: new FormControl(),
    observateurs: new FormControl(),
    temperature: new FormControl(),
    meteos: new FormControl(),
    associes: new FormControl(),
    heure: new FormControl(),
    duree: new FormControl(),
    especeGroup: new FormGroup({
      classe: new FormControl(),
      especes: new FormControl()
    }),
    lieuditGroup: new FormGroup({
      departement: new FormControl(),
      commune: new FormControl(),
      lieuxdits: new FormControl()
    }),
    nombreGroup: new FormGroup({
      nombre: new FormControl(),
      estimationsNombre: new FormControl()
    }),
    sexes: new FormControl(),
    ages: new FormControl(),
    distanceGroup: new FormGroup({
      distance: new FormControl(),
      estimationsDistance: new FormControl()
    }),
    regroupement: new FormControl(),
    fromDate: new FormControl(),
    toDate: new FormControl(),
    commentaire: new FormControl(),
    comportements: new FormControl(),
    milieux: new FormControl(),
    excelMode: new FormControl()
  });

  public observateurs: Observateur[];
  public departements$: Subject<Departement[]>;
  public communes$: Subject<Commune[]>;
  public lieuxdits$: Subject<Lieudit[]>;
  public classes$: Subject<Classe[]>;
  public especes$: Subject<Espece[]>;
  public estimationsNombre: EstimationNombre[];
  public estimationsDistance: EstimationDistance[];
  public sexes: Sexe[];
  public ages: Age[];
  public comportements: Comportement[];
  public milieux: Milieu[];
  public meteos: Meteo[];

  public displayWaitPanel: boolean = false;

  public donneesToDisplay: any[] = [];

  constructor(private backendApiService: BackendApiService) {}

  public ngOnInit(): void {
    this.classes$ = new Subject();
    this.especes$ = new Subject();
    this.departements$ = new Subject();
    this.communes$ = new Subject();
    this.lieuxdits$ = new Subject();

    combineLatest(
      this.backendApiService.getAllEntities("classe") as Observable<Classe[]>,
      this.backendApiService.getAllEntities("espece") as Observable<Espece[]>,
      this.backendApiService.getAllEntities("departement") as Observable<
        Departement[]
      >,
      this.backendApiService.getAllEntities("commune") as Observable<Commune[]>,
      this.backendApiService.getAllEntities("lieudit") as Observable<Lieudit[]>,
      this.backendApiService.getAllEntities("observateur") as Observable<
        Observateur[]
      >,
      this.backendApiService.getAllEntities("sexe") as Observable<Sexe[]>,
      this.backendApiService.getAllEntities("age") as Observable<Age[]>,
      this.backendApiService.getAllEntities("estimation-nombre") as Observable<
        EstimationNombre[]
      >,
      this.backendApiService.getAllEntities(
        "estimation-distance"
      ) as Observable<EstimationDistance[]>,
      this.backendApiService.getAllEntities("comportement") as Observable<
        Comportement[]
      >,
      this.backendApiService.getAllEntities("milieu") as Observable<Milieu[]>,
      this.backendApiService.getAllEntities("meteo") as Observable<Meteo[]>
    ).subscribe(
      (
        result: [
          Classe[],
          Espece[],
          Departement[],
          Commune[],
          Lieudit[],
          Observateur[],
          Sexe[],
          Age[],
          EstimationNombre[],
          EstimationDistance[],
          Comportement[],
          Milieu[],
          Meteo[]
        ]
      ) => {
        this.classes$.next(!!result[0] ? result[0] : []);
        this.especes$.next(!!result[1] ? result[1] : []);
        this.departements$.next(!!result[2] ? result[2] : []);
        this.communes$.next(!!result[3] ? result[3] : []);
        this.lieuxdits$.next(!!result[4] ? result[4] : []);
        this.observateurs = !!result[5] ? result[5] : [];
        this.sexes = !!result[6] ? result[6] : [];
        this.ages = !!result[7] ? result[7] : [];
        this.estimationsNombre = !!result[8] ? result[8] : [];
        this.estimationsDistance = !!result[9] ? result[9] : [];
        this.comportements = !!result[10] ? result[10] : [];
        this.milieux = !!result[11] ? result[11] : [];
        this.meteos = !!result[12] ? result[12] : [];
      },
      (error: HttpErrorResponse) => {
        console.error(
          "Impossible de trouver les classes ou les espèces (" + error + ")"
        );
      }
    );
  }

  public onSearchButtonClicked(): void {
    this.displayWaitPanel = true;

    if (this.searchForm.controls.excelMode.value) {
      this.backendApiService
        .exportDonneesByCustomizedFilters(this.searchForm.value)
        .subscribe(
          (response: any) => {
            this.displayWaitPanel = false;
            this.donneesToDisplay = [];
            saveFile(
              response.body,
              "donnees.xlsx",
              getContentTypeFromResponse(response)
            );
          },
          (error: any) => {
            PageStatusHelper.setErrorStatus(
              "Impossible de récupérer les fiches espèces.",
              error
            );
            this.displayWaitPanel = false;
          }
        );
    } else {
      this.backendApiService
        .getDonneesByCustomizedFilters(this.searchForm.value)
        .subscribe(
          (results: any) => {
            this.displayWaitPanel = false;
            this.donneesToDisplay = results;
          },
          (error: any) => {
            PageStatusHelper.setErrorStatus(
              "Impossible de récupérer les fiches espèces.",
              error
            );
            this.displayWaitPanel = false;
          }
        );
    }
  }
}
