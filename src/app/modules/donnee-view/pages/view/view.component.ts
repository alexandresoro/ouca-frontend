import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatTabGroup } from '@angular/material/tabs';
import { ApolloQueryResult } from "@apollo/client/core";
import { Apollo, gql } from "apollo-angular";
import { BehaviorSubject, combineLatest, Observable, Subject } from "rxjs";
import { map, takeUntil, withLatestFrom } from "rxjs/operators";
import { getDateFromString } from 'src/app/date-adapter/date-fns-adapter';
import { COORDINATES_SYSTEMS_CONFIG } from 'src/app/model/coordinates-system/coordinates-system-list.object';
import { CoordinatesSystem } from 'src/app/model/coordinates-system/coordinates-system.object';
import { Age, Classe, Commune, Comportement, CoordinatesSystemType, Departement, Espece, EstimationDistance, EstimationNombre, LieuDit, Meteo, Milieu, Observateur, Sexe } from "src/app/model/graphql";
import { DonneesFilter } from 'src/app/model/types/donnees-filter.object';
import { FlatDonnee } from 'src/app/model/types/flat-donnee.object';
import { Nicheur, NICHEUR_VALUES } from 'src/app/model/types/nicheur.model';
import { interpretBrowserDateAsTimestampDate } from 'src/app/modules/shared/helpers/time.helper';
import { BackendApiService } from "src/app/services/backend-api.service";
import { StatusMessageService } from "../../../../services/status-message.service";
import { getContentTypeFromResponse, saveFile } from "../../../shared/helpers/file-downloader.helper";
import { EspeceWithNbDonnees } from "../../components/table-especes-with-nb-donnees/table-especes-with-nb-donnees.component";
import { SearchCriteriaService } from "../../services/search-criteria.service";

type ViewQueryResult = {
  ages: Age[],
  classes: Classe[],
  comportements: Comportement[],
  especes: Espece[],
  estimationsNombre: EstimationNombre[],
  estimationsDistance: EstimationDistance[],
  meteos: Meteo[],
  milieux: Milieu[],
  observateurs: Observateur[]
  sexes: Sexe[],
  settings: {
    coordinatesSystem: CoordinatesSystemType
  }
  communes: Commune[]; // Note that these 3 are only required because they are inputs of input-lieudit which is shared with creation.
  departements: Departement[], // And as creation needs them directly, it was provided as input of input-lieudit to avoid a second costly call
  lieuxDits: LieuDit[];
}

const VIEW_QUERY = gql`
  query {
    ages {
      id
      libelle
    }
    classes {
      id
      libelle
    }
    communes {
      id
      code
      nom
      departement {
        id
        code
      }
    }
    comportements {
      id
      code
      libelle
      nicheur
    }
    departements {
      id
      code
    }
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
    estimationsNombre {
      id
      libelle
      nonCompte
    }
    estimationsDistance {
      id
      libelle
    }
    lieuxDits {
      id
      nom
      altitude
      longitude
      latitude
      coordinatesSystem
      commune {
        id
        code
        nom
        departement {
          id
          code
        }
      }
    }
    meteos {
      id
      libelle
    }
    milieux {
      id
      code
      libelle
    }
    observateurs {
      id
      libelle
    }
    sexes {
      id
      libelle
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
  public classes$: Observable<Classe[]>;
  public especes$: Observable<Espece[]>;

  public filteredEspeces$: Observable<Omit<Espece, 'classe'>[]> = new Observable<
    Omit<Espece, 'classe'>[]
  >();

  private selectedClasse$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>(null);

  private selectedDepartement$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>(null);

  private selectedCommune$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>(null);

  public estimationsNombre$: Observable<EstimationNombre[]>;
  public estimationsDistance$: Observable<EstimationDistance[]>;
  public sexes$: Observable<Sexe[]>;
  public ages$: Observable<Age[]>;
  public comportements$: Observable<Comportement[]>;
  public milieux$: Observable<Milieu[]>;
  public meteos$: Observable<Meteo[]>;

  public lieuxDits$: Observable<LieuDit[]>;

  public filteredLieuxdits$: Observable<LieuDit[]>;

  public communes$: Observable<Commune[]>;

  public filteredCommunes$: Observable<Commune[]>;

  public departements$: Observable<Departement[]>;

  public nicheursStatuses: Nicheur[] = Object.values(NICHEUR_VALUES);
  public displayWaitPanel$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  public displayNoDataPanel$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  public donneesToDisplay: FlatDonnee[] = [];

  public especesWithNbDonnees: EspeceWithNbDonnees[] = [];

  public lieuGroup: FormGroup = this.searchForm.controls[
    "lieuditGroup"
  ] as FormGroup;

  public especeGroup: FormGroup = this.searchForm.controls[
    "especeGroup"
  ] as FormGroup;

  public nombreGroup: FormGroup = this.searchForm.controls[
    "nombreGroup"
  ] as FormGroup;

  public distanceGroup: FormGroup = this.searchForm.controls[
    "distanceGroup"
  ] as FormGroup;

  @ViewChild('searchTabs') searchTabs: MatTabGroup;
  private QUICK_SEARCH_TAB_INDEX = 0;

  constructor(
    private apollo: Apollo,
    private backendApiService: BackendApiService,
    private statusMessageService: StatusMessageService,
    private searchCriteriaService: SearchCriteriaService
  ) {

    this.viewQuery$ = this.apollo.watchQuery<ViewQueryResult>({
      query: VIEW_QUERY
    }).valueChanges.pipe(
      takeUntil(this.destroy$)
    );

    this.observateurs$ = this.viewQuery$.pipe(
      map(({ data }) => data?.observateurs)
    );
    this.estimationsNombre$ = this.viewQuery$.pipe(
      map(({ data }) => data?.estimationsNombre)
    );
    this.estimationsDistance$ = this.viewQuery$.pipe(
      map(({ data }) => data?.estimationsDistance)
    );
    this.classes$ = this.viewQuery$.pipe(
      map(({ data }) => data?.classes)
    );
    this.especes$ = this.viewQuery$.pipe(
      map(({ data }) => data?.especes)
    );
    this.sexes$ = this.viewQuery$.pipe(
      map(({ data }) => data?.sexes)
    );
    this.ages$ = this.viewQuery$.pipe(
      map(({ data }) => data?.ages)
    );
    this.comportements$ = this.viewQuery$.pipe(
      map(({ data }) => data?.comportements)
    );
    this.milieux$ = this.viewQuery$.pipe(
      map(({ data }) => data?.milieux)
    );
    this.meteos$ = this.viewQuery$.pipe(
      map(({ data }) => data?.meteos)
    );

    this.lieuxDits$ = this.viewQuery$.pipe(
      map(({ data }) => data?.lieuxDits)
    );
    this.communes$ = this.viewQuery$.pipe(
      map(({ data }) => data?.communes)
    );
    this.departements$ = this.viewQuery$.pipe(
      map(({ data }) => data?.departements)
    );

    this.viewQuery$.subscribe(({ data }) => {
      this.searchForm.controls.coordinatesSystemType.setValue(data?.settings?.coordinatesSystem);
    });
  }

  public ngOnInit(): void {

    this.especeGroup.get("classes").valueChanges.pipe(takeUntil(this.destroy$)).subscribe((newValue) => {
      // This is done because when we first reach this component, we may have no value changes triggered,
      // so we need to initialize it with null (see the BehaviorSubject above)
      this.selectedClasse$.next(newValue);
    });

    this.lieuGroup.get("departements").valueChanges.pipe(takeUntil(this.destroy$)).subscribe((newValue) => {
      // This is done because when we first reach this component, we may have no value changes triggered,
      // so we need to initialize it with null (see the BehaviorSubject above)
      this.selectedDepartement$.next(newValue);
    });

    this.lieuGroup.get("communes").valueChanges.pipe(takeUntil(this.destroy$)).subscribe((newValue) => {
      // This is done because when we first reach this component, we may have no value changes triggered,
      // so we need to initialize it with null (see the BehaviorSubject above)
      this.selectedCommune$.next(newValue);
    });

    this.filteredEspeces$ = combineLatest(
      this.selectedClasse$,
      this.especes$,
      (selection, especes) => {
        if (especes) {
          if (selection?.length > 0) {
            return especes.filter((espece) => {
              return selection.includes(espece?.classe?.id);
            });
          } else {
            return especes;
          }
        } else {
          return [];
        }
      }
    ).pipe(takeUntil(this.destroy$));

    this.filteredCommunes$ = combineLatest(
      this.selectedDepartement$,
      this.communes$,
      (selection, communes) => {
        if (communes && selection?.length > 0) {
          return communes.filter((commune) => {
            return selection.includes(commune?.departement?.id);
          });
        } else {
          return [];
        }
      }
    ).pipe(takeUntil(this.destroy$));

    this.filteredLieuxdits$ = combineLatest(
      this.selectedCommune$,
      this.lieuxDits$,
      (selection, lieuxDits) => {
        if (lieuxDits && selection?.length > 0) {
          return lieuxDits.filter((lieuDit) => {
            return selection.includes(lieuDit?.commune?.id);
          });
        } else {
          return [];
        }
      }
    ).pipe(takeUntil(this.destroy$));

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
        .pipe(
          withLatestFrom(this.especes$),
        )
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
    especes: Espece[]
  ): void => {


    const nbDonneesByEspeceMap = donnees?.reduce<Record<string, number>>((acc, value) => {
      const codeEspece = value.codeEspece;
      acc[codeEspece] = (acc[codeEspece] ?? 0) + 1;
      return acc;
    }, {}) ?? {};

    this.especesWithNbDonnees = Object.entries(nbDonneesByEspeceMap)?.map(([key, value]) => {
      const espece = especes?.find((espece) => {
        return espece.code === key;
      });

      return {
        ...espece,
        nbDonnees: value
      };
    }) ?? [];
  };
}
