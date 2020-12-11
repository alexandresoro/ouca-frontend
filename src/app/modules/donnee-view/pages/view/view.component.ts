import { ChangeDetectionStrategy, Component, OnDestroy, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatTabGroup } from '@angular/material/tabs';
import { Age } from "@ou-ca/ouca-model/age.object";
import { Comportement } from "@ou-ca/ouca-model/comportement.object";
import { CoordinatesSystem, COORDINATES_SYSTEMS_CONFIG } from "@ou-ca/ouca-model/coordinates-system";
import { DonneesFilter } from "@ou-ca/ouca-model/donnees-filter.object";
import { EstimationDistance } from "@ou-ca/ouca-model/estimation-distance.object";
import { EstimationNombre } from "@ou-ca/ouca-model/estimation-nombre.object";
import { FlatDonnee } from "@ou-ca/ouca-model/flat-donnee.object";
import { Meteo } from "@ou-ca/ouca-model/meteo.object";
import { Milieu } from "@ou-ca/ouca-model/milieu.object";
import { Nicheur, NICHEUR_VALUES } from "@ou-ca/ouca-model/nicheur.model";
import { Observateur } from "@ou-ca/ouca-model/observateur.object";
import { Sexe } from "@ou-ca/ouca-model/sexe.object";
import * as _ from "lodash";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { withLatestFrom } from "rxjs/operators";
import { getDateFromString } from 'src/app/date-adapter/date-fns-adapter';
import { UIEspece } from "src/app/models/espece.model";
import { interpretBrowserDateAsTimestampDate } from 'src/app/modules/shared/helpers/time.helper';
import { AppConfigurationService } from "src/app/services/app-configuration.service";
import { BackendApiService } from "src/app/services/backend-api.service";
import { EntitiesStoreService } from "src/app/services/entities-store.service";
import { StatusMessageService } from "../../../../services/status-message.service";
import { getContentTypeFromResponse, saveFile } from "../../../shared/helpers/file-downloader.helper";
import { EspeceWithNbDonnees } from "../../models/espece-with-nb-donnees.model";
import { SearchCriteriaService } from "../../services/search-criteria.service";
@Component({
  styleUrls: ["./view.component.scss"],
  templateUrl: "./view.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewComponent implements OnDestroy {
  private readonly destroy$ = new Subject();

  public coordinatesSystems: CoordinatesSystem[] = Object.values(
    COORDINATES_SYSTEMS_CONFIG
  );

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
    nicheurs: new FormControl(),
    comportements: new FormControl(),
    milieux: new FormControl(),
    coordinatesSystemType: new FormControl(),
    excelMode: new FormControl()
  });

  public observateurs$: Observable<Observateur[]>;
  public especes$: Observable<UIEspece[]>;
  public estimationsNombre$: Observable<EstimationNombre[]>;
  public estimationsDistance$: Observable<EstimationDistance[]>;
  public sexes$: Observable<Sexe[]>;
  public ages$: Observable<Age[]>;
  public comportements$: Observable<Comportement[]>;
  public milieux$: Observable<Milieu[]>;
  public meteos$: Observable<Meteo[]>;
  public nicheursStatuses: Nicheur[] = Object.values(NICHEUR_VALUES);
  public displayWaitPanel$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  public displayNoDataPanel$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  public donneesToDisplay: FlatDonnee[] = [];

  public especesWithNbDonnees: EspeceWithNbDonnees[] = [];

  public nombreGroup: FormGroup = this.searchForm.controls[
    "nombreGroup"
  ] as FormGroup;

  public distanceGroup: FormGroup = this.searchForm.controls[
    "distanceGroup"
  ] as FormGroup;

  @ViewChild('searchTabs') searchTabs: MatTabGroup;
  private QUICK_SEARCH_TAB_INDEX = 0;

  constructor(
    private appConfigurationService: AppConfigurationService,
    private backendApiService: BackendApiService,
    private statusMessageService: StatusMessageService,
    private entitiesStoreService: EntitiesStoreService,
    private searchCriteriaService: SearchCriteriaService
  ) {
    this.observateurs$ = this.entitiesStoreService.getObservateurs$();
    this.estimationsNombre$ = this.entitiesStoreService.getEstimationNombres$();
    this.estimationsDistance$ = this.entitiesStoreService.getEstimationDistances$();
    this.especes$ = this.entitiesStoreService.getEspeces$();
    this.sexes$ = this.entitiesStoreService.getSexes$();
    this.ages$ = this.entitiesStoreService.getAges$();
    this.comportements$ = this.entitiesStoreService.getComportements$();
    this.milieux$ = this.entitiesStoreService.getMilieux$();
    this.meteos$ = this.entitiesStoreService.getMeteos$();

    this.appConfigurationService
      .getAppCoordinatesSystemType$()
      .subscribe((system) => {
        this.searchForm.controls.coordinatesSystemType.setValue(system);
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private buildSearchCriteraFromQuickSearchPanel = (): DonneesFilter => {
    const options = this.searchCriteriaService.getCurrentSearchCriteria();

    const searchCriteria: DonneesFilter = {
      id: null,
      observateurs: [],
      associes: [],
      fromDate: null,
      toDate: null,
      heure: null,
      duree: null,
      lieuditGroup: {
        departements: [],
        communes: [],
        lieuxdits: []
      },
      temperature: null,
      meteos: [],
      especeGroup: {
        classes: [],
        especes: []
      },
      sexes: [],
      ages: [],
      nombreGroup: {
        estimationsNombre: [],
        nombre: null
      },
      distanceGroup: {
        estimationsDistance: [],
        distance: null
      },
      regroupement: null,
      comportements: [],
      milieux: [],
      nicheurs: [],
      commentaire: null,
      excelMode: this.searchForm.value.excelMode,
      coordinatesSystemType: this.searchForm.value.coordinatesSystemType
    };

    if (options) {
      for (const option of options) {
        const object = option.object;
        switch (option.type) {
          case "id":
            searchCriteria.id = object;
            break;
          case "observateur":
            searchCriteria.observateurs.push(object.id);
            break;
          case "associe":
            searchCriteria.associes.push(object.id);
            break;
          case "date":
            searchCriteria.fromDate = getDateFromString(object);
            searchCriteria.toDate = getDateFromString(object);
            break;
          case "dateMin":
            searchCriteria.fromDate = getDateFromString(object);
            break;
          case "dateMax":
            searchCriteria.toDate = getDateFromString(object);
            break;
          case "heure":
            searchCriteria.heure = object;
            break;
          case "duree":
            searchCriteria.duree = object;
            break;
          case "departement":
            searchCriteria.lieuditGroup.departements.push(object.id);
            break;
          case "commune":
            searchCriteria.lieuditGroup.communes.push(object.id);
            break;
          case "lieuDit":
            searchCriteria.lieuditGroup.lieuxdits.push(object.id);
            break;
          case "temperature":
            searchCriteria.temperature = +object;
            break;
          case "meteo":
            searchCriteria.meteos.push(object.id);
            break;
          case "classe":
            searchCriteria.especeGroup.classes.push(object.id);
            break;
          case "espece":
            searchCriteria.especeGroup.especes.push(object.id);
            break;
          case "sexe":
            searchCriteria.sexes.push(object.id);
            break;
          case "age":
            searchCriteria.ages.push(object.id);
            break;
          case "nombre":
            searchCriteria.nombreGroup.nombre = +object;
            break;
          case "estimationNombre":
            searchCriteria.nombreGroup.estimationsNombre.push(object.id);
            break;
          case "distance":
            searchCriteria.distanceGroup.distance = +object;
            break;
          case "estimationDistance":
            searchCriteria.distanceGroup.estimationsDistance.push(object.id);
            break;
          case "regroupement":
            searchCriteria.regroupement = +object;
            break;
          case "comportement":
            searchCriteria.comportements.push(object.id);
            break;
          case "milieu":
            searchCriteria.milieux.push(object.id);
            break;
          case "nicheur":
            searchCriteria.nicheurs.push(object.id);
            break;
          case "commentaire":
            searchCriteria.commentaire = object;
            break;
        }
      }
    }

    return searchCriteria;
  };

  private buildSearchCriteriaFromDetailledSearchPanel = (): DonneesFilter => {
    const filters: DonneesFilter = this.searchForm.value;
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
     return filters;
  }

  public onSearchButtonClicked(): void {
    this.displayWaitPanel$.next(true);
    this.displayNoDataPanel$.next(false);
    this.donneesToDisplay = [];
    this.especesWithNbDonnees = [];

    let filters: DonneesFilter;
    
    if (this.searchTabs.selectedIndex == this.QUICK_SEARCH_TAB_INDEX) {
       filters = this.buildSearchCriteraFromQuickSearchPanel();
    } else {
      filters = this.buildSearchCriteriaFromDetailledSearchPanel();
    }
    
    // Send the dates in UTC  
    if (filters.excelMode) {
      this.backendApiService
        .exportDonneesByCustomizedFilters(filters)
        .subscribe((response) => {
          this.displayWaitPanel$.next(false);

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
          this.displayWaitPanel$.next(false);
          this.donneesToDisplay = results;
          this.setEspecesWithNbDonnees(this.donneesToDisplay, especes);
          this.displayNoDataPanel$.next(this.donneesToDisplay.length === 0);
        });
    }
  }

  /**
   * Counts number of donnees by code espece
   */
  private setEspecesWithNbDonnees = (
    donnees: FlatDonnee[],
    especes: UIEspece[]
  ): void => {
    const nbDonneesByEspeceMap: { [key: string]: number } = _.countBy(
      donnees,
      (donnee) => {
        return donnee.codeEspece;
      }
    );

    this.especesWithNbDonnees = _.map(nbDonneesByEspeceMap, (value, key) => {
      const espece: UIEspece = _.find(especes, (espece) => {
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
