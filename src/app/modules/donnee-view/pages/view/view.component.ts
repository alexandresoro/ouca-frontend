import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import * as _ from "lodash";
import { Age } from "ouca-common/age.object";
import { Comportement } from "ouca-common/comportement.object";
import { DonneesFilter } from "ouca-common/donnees-filter.object";
import { Espece } from "ouca-common/espece.object";
import { EstimationDistance } from "ouca-common/estimation-distance.object";
import { EstimationNombre } from "ouca-common/estimation-nombre.object";
import { FlatDonnee } from "ouca-common/flat-donnee.object";
import { Meteo } from "ouca-common/meteo.object";
import { Milieu } from "ouca-common/milieu.object";
import { Observateur } from "ouca-common/observateur.object";
import { Sexe } from "ouca-common/sexe.object";
import { Observable, Subject } from "rxjs";
import { withLatestFrom } from "rxjs/operators";
import { interpretBrowserDateAsTimestampDate } from "src/app/modules/shared/helpers/time.helper";
import { BackendApiService } from "src/app/services/backend-api.service";
import { CreationPageModelService } from "src/app/services/creation-page-model.service";
import { StatusMessageService } from "../../../../services/status-message.service";
import {
  getContentTypeFromResponse,
  saveFile
} from "../../../shared/helpers/file-downloader.helper";
import { EspeceWithNbDonnees } from "../../models/espece-with-nb-donnees.model";
@Component({
  styleUrls: ["./view.component.scss"],
  templateUrl: "./view.component.html"
})
export class ViewComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject();

  public searchForm: FormGroup = new FormGroup({
    id: new FormControl(),
    observateurs: new FormControl(),
    temperature: new FormControl(),
    meteos: new FormControl(),
    associes: new FormControl(),
    heure: new FormControl(),
    duree: new FormControl(),
    especeGroup: new FormGroup({
      classes: new FormControl(),
      especes: new FormControl()
    }),
    lieuditGroup: new FormGroup({
      departements: new FormControl(),
      communes: new FormControl(),
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

  public observateurs$: Observable<Observateur[]>;
  public especes$: Observable<Espece[]>;
  public estimationsNombre$: Observable<EstimationNombre[]>;
  public estimationsDistance$: Observable<EstimationDistance[]>;
  public sexes$: Observable<Sexe[]>;
  public ages$: Observable<Age[]>;
  public comportements$: Observable<Comportement[]>;
  public milieux$: Observable<Milieu[]>;
  public meteos$: Observable<Meteo[]>;

  public displayWaitPanel: boolean = false;

  public displayNoDataPanel: boolean = false;

  public donneesToDisplay: FlatDonnee[] = [];

  public especesWithNbDonnees: EspeceWithNbDonnees[] = [];

  public nombreGroup: FormGroup = this.searchForm.controls[
    "nombreGroup"
  ] as FormGroup;

  public distanceGroup: FormGroup = this.searchForm.controls[
    "distanceGroup"
  ] as FormGroup;

  constructor(
    private backendApiService: BackendApiService,
    private statusMessageService: StatusMessageService,
    private creationPageModelService: CreationPageModelService
  ) {
    this.observateurs$ = this.creationPageModelService.getObservateurs$();
    this.estimationsNombre$ = this.creationPageModelService.getEstimationNombres$();
    this.estimationsDistance$ = this.creationPageModelService.getEstimationDistances$();
    this.especes$ = this.creationPageModelService.getEspeces$();
    this.sexes$ = this.creationPageModelService.getSexes$();
    this.ages$ = this.creationPageModelService.getAges$();
    this.comportements$ = this.creationPageModelService.getComportements$();
    this.milieux$ = this.creationPageModelService.getMilieux$();
    this.meteos$ = this.creationPageModelService.getMeteos$();
  }

  public ngOnInit(): void {
    // this.creationPageModelService.refreshPageModel();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onSearchButtonClicked(): void {
    this.displayWaitPanel = true;
    this.displayNoDataPanel = false;
    this.donneesToDisplay = [];
    this.especesWithNbDonnees = [];

    const filters: DonneesFilter = this.searchForm.value;
    // Send the dates in UTC
    filters.fromDate = filters.fromDate
      ? interpretBrowserDateAsTimestampDate(
          this.searchForm.controls.fromDate.value
        )
      : null;
    filters.toDate = filters.toDate
      ? interpretBrowserDateAsTimestampDate(
          this.searchForm.controls.toDate.value
        )
      : null;

    if (this.searchForm.controls.excelMode.value) {
      this.backendApiService
        .exportDonneesByCustomizedFilters(filters)
        .subscribe((response) => {
          this.displayWaitPanel = false;

          // This is an ugly "bidouille"
          // The export can exceed tha maximum supported number of data (set in backend)
          // If so, instead of returning the Excel file, it will return an error object
          // So, as this is returned as a blob, we first parse the received blob to check if this is a JSON
          // If this is a JSON, it means that it is not the Excel file, and we display what went wrong (in reason)
          // If this is the excel file, the JSON.parse will fail, so we can safely download it
          // This is really an ugly bidouille :-D
          const reader = new FileReader();
          reader.onload = (): void => {
            let isErrorCase = false;
            try {
              this.statusMessageService.showErrorMessage(
                JSON.parse(reader.result as string).reason
              );
              isErrorCase = true;
            } catch (e) {
              //
            }
            if (!isErrorCase) {
              saveFile(
                response.body,
                "donnees.xlsx",
                getContentTypeFromResponse(response)
              );
            }
          };
          reader.readAsText(response.body);
        });
    } else {
      this.backendApiService
        .getDonneesByCustomizedFilters(filters)
        .pipe(withLatestFrom(this.especes$))
        .subscribe(([results, especes]) => {
          this.displayWaitPanel = false;
          this.donneesToDisplay = results;
          this.setEspecesWithNbDonnees(this.donneesToDisplay, especes);
          this.displayNoDataPanel = this.donneesToDisplay.length === 0;
        });
    }
  }

  /**
   * Counts number of donnees by code espece
   */
  private setEspecesWithNbDonnees = (
    donnees: FlatDonnee[],
    especes: Espece[]
  ): void => {
    const nbDonneesByEspeceMap: { [key: string]: number } = _.countBy(
      donnees,
      (donnee) => {
        return donnee.codeEspece;
      }
    );

    this.especesWithNbDonnees = _.map(nbDonneesByEspeceMap, (value, key) => {
      const espece: Espece = _.find(especes, (espece) => {
        return espece.code === key;
      });

      return {
        classe: espece.classe.libelle,
        code: key,
        nomFrancais: espece.nomFrancais,
        nomLatin: espece.nomLatin,
        nbDonnees: value
      };
    });
  };
}
