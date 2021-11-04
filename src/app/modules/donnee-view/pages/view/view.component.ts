import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ApolloQueryResult } from "@apollo/client/core";
import { Apollo, gql } from "apollo-angular";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { map, takeUntil, withLatestFrom } from "rxjs/operators";
import { getDateFromString } from 'src/app/date-adapter/date-fns-adapter';
import { COORDINATES_SYSTEMS_CONFIG } from 'src/app/model/coordinates-system/coordinates-system-list.object';
import { CoordinatesSystem } from 'src/app/model/coordinates-system/coordinates-system.object';
import { CoordinatesSystemType, Espece } from "src/app/model/graphql";
import { DonneesFilter } from 'src/app/model/types/donnees-filter.object';
import { FlatDonnee } from 'src/app/model/types/flat-donnee.object';
import { BackendApiService } from "src/app/services/backend-api.service";
import { StatusMessageService } from "../../../../services/status-message.service";
import { getContentTypeFromResponse, saveFile } from "../../../shared/helpers/file-downloader.helper";
import { SearchCriteriaService } from "../../services/search-criteria.service";

type EspeceWithNbDonnees = Espece & {
  nbDonnees: number
}

type ViewQueryResult = {
  especes: Espece[],
  settings: {
    coordinatesSystem: CoordinatesSystemType
  }
}

const VIEW_QUERY = gql`
  query {
    especes {
      id
      code
      nomFrancais
      nomLatin
      classe {
        id
        libelle
      }
    }
    settings {
      id
      coordinatesSystem
    }
  }
`;

@Component({
  styleUrls: ["./view.component.scss"],
  templateUrl: "./view.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject();

  private viewQuery$: Observable<ApolloQueryResult<ViewQueryResult>>;

  public coordinatesSystems: CoordinatesSystem[] = Object.values(
    COORDINATES_SYSTEMS_CONFIG
  );

  public searchForm: FormGroup = new FormGroup({
    coordinatesSystemType: new FormControl(),
    excelMode: new FormControl()
  });

  public especes$: Observable<Espece[]>;

  public displayWaitPanel$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  public displayNoDataPanel$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  public donneesToDisplay: FlatDonnee[] = [];

  constructor(
    private apollo: Apollo,
    private backendApiService: BackendApiService,
    private statusMessageService: StatusMessageService,
    private searchCriteriaService: SearchCriteriaService
  ) {
  }

  public ngOnInit(): void {

    this.viewQuery$ = this.apollo.watchQuery<ViewQueryResult>({
      query: VIEW_QUERY
    }).valueChanges.pipe(
      takeUntil(this.destroy$)
    );

    this.especes$ = this.viewQuery$.pipe(
      map(({ data }) => data?.especes)
    );

    this.viewQuery$.subscribe(({ data }) => {
      this.searchForm.controls.coordinatesSystemType.setValue(data?.settings?.coordinatesSystem);
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

  public onSearchButtonClicked(): void {
    this.displayWaitPanel$.next(true);
    this.displayNoDataPanel$.next(false);
    this.donneesToDisplay = [];

    const filters = this.buildSearchCriteraFromQuickSearchPanel();

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
        .pipe(
          withLatestFrom(this.especes$),
        )
        .subscribe(([results, especes]) => {
          this.displayWaitPanel$.next(false);
          this.donneesToDisplay = results;
          this.displayNoDataPanel$.next(this.donneesToDisplay.length === 0);
        });
    }
  }

}
