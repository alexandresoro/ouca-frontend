import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatAutocomplete, MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { Apollo, gql } from "apollo-angular";
import deburr from 'lodash.deburr';
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { map, startWith, switchMap } from "rxjs/operators";
import { isADate } from "src/app/date-adapter/date-fns-adapter";
import { AgesPaginatedResult, AgeWithCounts, ClassesPaginatedResult, ClasseWithCounts, CommunesPaginatedResult, CommuneWithCounts, ComportementsPaginatedResult, ComportementWithCounts, DepartementsPaginatedResult, DepartementWithCounts, EspecesPaginatedResult, EspeceWithCounts, EstimationDistanceWithCounts, EstimationNombreWithCounts, EstimationsDistancePaginatedResult, EstimationsNombrePaginatedResult, LieuDitWithCounts, LieuxDitsPaginatedResult, MeteosPaginatedResult, MeteoWithCounts, MilieuWithCounts, MilieuxPaginatedResult, ObservateursPaginatedResult, ObservateurWithCounts, SearchParams, SexesPaginatedResult, SexeWithCounts } from "src/app/model/graphql";
import { EntiteAvecLibelleEtCode } from 'src/app/model/types/entite-avec-libelle-et-code.object';
import { Nicheur, NICHEUR_VALUES } from 'src/app/model/types/nicheur.model';
import { TimeHelper } from "src/app/modules/shared/helpers/time.helper";
import { SearchCriterion } from "../../models/search-criterion.model";
import { SearchCriteriaService } from "../../services/search-criteria.service";

type SearchWithCriteriaQueryResult = {
  paginatedDepartements: Pick<DepartementsPaginatedResult, 'result'>
  paginatedCommunes: Pick<CommunesPaginatedResult, 'result'>
  paginatedLieuxdits: Pick<LieuxDitsPaginatedResult, 'result'>
  paginatedEspeces: Pick<EspecesPaginatedResult, 'result'>
  paginatedClasses: Pick<ClassesPaginatedResult, 'result'>
  paginatedSexes: Pick<SexesPaginatedResult, 'result'>
  paginatedAges: Pick<AgesPaginatedResult, 'result'>
  paginatedComportements: Pick<ComportementsPaginatedResult, 'result'>
  paginatedMilieux: Pick<MilieuxPaginatedResult, 'result'>
  paginatedMeteos: Pick<MeteosPaginatedResult, 'result'>
  paginatedEstimationsNombre: Pick<EstimationsNombrePaginatedResult, 'result'>
  paginatedEstimationsDistance: Pick<EstimationsDistancePaginatedResult, 'result'>
  paginatedObservateurs: Pick<ObservateursPaginatedResult, 'result'>
}

const SEARCH_WITH_CRITERIA_QUERY = gql`
  query SearchWithCriteriaQuery($searchParams: SearchParams) {
    paginatedDepartements(searchParams: $searchParams) {
      result {
        id
        code
      }
    }
    paginatedCommunes(searchParams: $searchParams) {
      result {
        id
        code
        nom
        departement {
          id
          code
        }
      }
    }
    paginatedLieuxdits(searchParams: $searchParams) {
      result {
        id
        nom
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
    }
    paginatedEspeces(searchParams: $searchParams) {
      result {
        id
        code
        nomFrancais
        nomLatin
        classe {
          id
          libelle
        }
      }
    }
    paginatedClasses(searchParams: $searchParams) {
      result {
        id
        libelle
      }
    }
    paginatedSexes(searchParams: $searchParams) {
      result {
        id
        libelle
      }
    }
    paginatedAges(searchParams: $searchParams) {
      result {
        id
        libelle
      }
    }
    paginatedComportements(searchParams: $searchParams) {
      result {
        id
        code
        libelle
        nicheur
      }
    }
    paginatedMilieux(searchParams: $searchParams) {
      result {
        id
        code
        libelle
      }
    }
    paginatedMeteos(searchParams: $searchParams) {
      result {
        id
        libelle
      }
    }
    paginatedEstimationsNombre(searchParams: $searchParams) {
      result {
        id
        libelle
        nonCompte
      }
    }
    paginatedEstimationsDistance(searchParams: $searchParams) {
      result {
        id
        libelle
      }
    }
    paginatedObservateurs(searchParams: $searchParams) {
      result {
        id
        libelle
      }
    }
  }
`;


@Component({
  selector: "search",
  styleUrls: ["./search.component.scss"],
  templateUrl: "./search.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnDestroy, AfterViewInit {
  public searchCtrl: FormControl = new FormControl();
  @ViewChild("searchInput") searchInput: ElementRef<HTMLInputElement>;
  @ViewChild("auto") matAutocomplete: MatAutocomplete;

  public searchCriteria$: Observable<SearchCriterion[]>;

  public filteredObservateurs$: Observable<ObservateurWithCounts[]>;
  public filteredDepartements$: Observable<DepartementWithCounts[]>;
  public filteredCommunes$: Observable<CommuneWithCounts[]>;
  public filteredLieuxDits$: Observable<LieuDitWithCounts[]>;
  public filteredMeteos$: Observable<MeteoWithCounts[]>;
  public filteredClasses$: Observable<ClasseWithCounts[]>;
  public filteredEspeces$: Observable<EspeceWithCounts[]>;
  public filteredSexes$: Observable<SexeWithCounts[]>;
  public filteredAges$: Observable<AgeWithCounts[]>;
  public filteredEstimationsNombre$: Observable<EstimationNombreWithCounts[]>;
  public filteredEstimationsDistance$: Observable<EstimationDistanceWithCounts[]>;
  public filteredComportements$: Observable<ComportementWithCounts[]>;
  public filteredMilieux$: Observable<MilieuWithCounts[]>;
  public filteredNicheurs$: Observable<Nicheur[]>;
  public filteredOthers$: Observable<
    { type: string; object: string | number }[]
  >;

  private nicheursStatuses: Nicheur[] = Object.values(NICHEUR_VALUES);

  private CHARACTERS_TO_IGNORE = /(\s|\'|\-|\,)/g;

  private DEFAULT_NUMBER_OF_RESULTS_PER_TYPE = 10;
  private numberOfResultsPerType$ = new BehaviorSubject(
    this.DEFAULT_NUMBER_OF_RESULTS_PER_TYPE
  );

  private readonly destroy$ = new Subject();

  private searchResult$: Observable<SearchWithCriteriaQueryResult | null>;

  private pageNumber$: BehaviorSubject<number> = new BehaviorSubject(0);

  constructor(
    private apollo: Apollo,
    private searchCriteriaService: SearchCriteriaService
  ) {
    this.init();
  }

  public ngAfterViewInit(): void {
    this.matAutocomplete.closed.subscribe(() => {
      this.numberOfResultsPerType$.next(
        this.DEFAULT_NUMBER_OF_RESULTS_PER_TYPE
      );
      this.pageNumber$.next(0);
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private init = (): void => {

    this.searchResult$ = this.searchCtrl.valueChanges.pipe(
      startWith<string>(null as string),
      switchMap((searchValue) => {
        console.log(searchValue)
        if (!searchValue?.length) { // If the requested value is an empty string, do not display any result
          return of<null>(null);
        }
        return this.apollo.query<SearchWithCriteriaQueryResult, { searchParams: SearchParams }>({
          query: SEARCH_WITH_CRITERIA_QUERY, // TODO fetch policy ?
          variables: {
            searchParams: {
              q: searchValue,
              pageNumber: 0,
              pageSize: this.DEFAULT_NUMBER_OF_RESULTS_PER_TYPE
            }
          }
        }).pipe(
          map(({ data }) => data)
        );
      })
    );

    this.searchCriteria$ = this.searchCriteriaService.getCurrentSearchCriteria$();

    this.filteredObservateurs$ = this.searchResult$.pipe(
      map(result => result?.paginatedObservateurs?.result ?? [])
    )

    this.filteredDepartements$ = this.searchResult$.pipe(
      map(result => result?.paginatedDepartements?.result ?? [])
    )

    this.filteredCommunes$ = this.searchResult$.pipe(
      map(result => result?.paginatedCommunes?.result ?? [])
    )

    this.filteredLieuxDits$ = this.searchResult$.pipe(
      map(result => result?.paginatedLieuxdits?.result ?? [])
    )

    this.filteredMeteos$ = this.searchResult$.pipe(
      map(result => result?.paginatedMeteos?.result ?? [])
    )

    this.filteredClasses$ = this.searchResult$.pipe(
      map(result => result?.paginatedClasses?.result ?? [])
    )

    this.filteredEspeces$ = this.searchResult$.pipe(
      map(result => result?.paginatedEspeces?.result ?? [])
    )

    this.filteredSexes$ = this.searchResult$.pipe(
      map(result => result?.paginatedSexes?.result ?? [])
    )

    this.filteredAges$ = this.searchResult$.pipe(
      map(result => result?.paginatedAges?.result ?? [])
    )

    this.filteredEstimationsNombre$ = this.searchResult$.pipe(
      map(result => result?.paginatedEstimationsNombre?.result ?? [])
    )

    this.filteredEstimationsDistance$ = this.searchResult$.pipe(
      map(result => result?.paginatedEstimationsDistance?.result ?? [])
    )

    this.filteredComportements$ = this.searchResult$.pipe(
      map(result => result?.paginatedComportements?.result ?? [])
    )

    this.filteredMilieux$ = this.searchResult$.pipe(
      map(result => result?.paginatedMilieux?.result ?? [])
    )

    this.filteredNicheurs$ = this.searchCtrl.valueChanges.pipe(
      startWith(null),
      map((filterValue: any) =>
        this.filterNicheurs(this.nicheursStatuses, filterValue)
      )
    );

    this.filteredOthers$ = this.searchCtrl.valueChanges.pipe(
      startWith(null),
      map((filterValue) => this.filterOthers(filterValue))
    );
  };

  public selectChip(event: MatAutocompleteSelectedEvent): void {
    this.searchCriteriaService.addCriterion(event.option.value);
    this.searchInput.nativeElement.value = "";
    this.searchCtrl.setValue(null);
  }

  public removeChip(criterion: any): void {
    this.searchCriteriaService.removeCriterion(criterion);
  }

  private filterNicheurs = (
    allNicheurs: Nicheur[],
    filterValue: any
  ): Nicheur[] => {
    if (filterValue && !filterValue.type) {
      const valueToFind = this.transformValue(filterValue);
      return allNicheurs.filter((nicheur) =>
        this.transformValue(nicheur.name).includes(valueToFind)
      );
    } else {
      return [];
    }
  };

  private filterOthers = (filterValue: any): any[] => {
    const result = [];

    if (filterValue && !filterValue.type) {
      const valueToFind = filterValue.toLowerCase();
      const valueNb = Number(valueToFind);

      if (!isNaN(valueNb)) {
        result.push({
          type: "nombre",
          object: valueNb
        });
        result.push({
          type: "distance",
          object: valueNb
        });
        result.push({
          type: "temperature",
          object: valueNb
        });
        result.push({
          type: "regroupement",
          object: valueNb
        });
        result.push({
          type: "id",
          object: valueNb
        });
      } else if (isADate(valueToFind)) {
        result.push({
          type: "date",
          object: valueToFind
        });
        result.push({
          type: "dateMin",
          object: valueToFind
        });
        result.push({
          type: "dateMax",
          object: valueToFind
        });
      } else if (TimeHelper.isATime(valueToFind)) {
        const time = TimeHelper.getFormattedTime(valueToFind);
        result.push({
          type: "heure",
          object: time
        });
        result.push({
          type: "duree",
          object: time
        });
      }

      result.push({
        type: "commentaire",
        object: valueToFind
      });
    }

    return result;
  };

  public getDisplayedDepartement = (departement: DepartementWithCounts): string => {
    return "Département : " + departement.code;
  };

  public getDisplayedCommune = (commune: CommuneWithCounts): string => {
    return `Commune : ${commune.nom} (${commune.departement.code})`;
  };

  public getDisplayedLieuDit = (lieuDit: LieuDitWithCounts): string => {
    return `Lieu-dit : ${lieuDit.nom} à ${this.getDisplayedCommune(lieuDit.commune)}`;
  };

  public getDisplayedEspece = (espece: EspeceWithCounts): string => {
    return "Espèce : " + espece.nomFrancais + " (" + espece.code + ")";
  };

  public getDisplayedNicheur = (nicheur: Nicheur): string => {
    return "Nicheur : " + nicheur.name;
  };

  public getDisplayedNombre = (nombre: number): string => {
    return "Nombre d'individus : " + nombre;
  };

  public getDisplayedTemperature = (temperature: number): string => {
    return "Température : " + temperature;
  };

  public getDisplayedDistance = (distance: number): string => {
    return "Distance de contact : " + distance;
  };

  public getDisplayedID = (id: number): string => {
    return "ID : " + id;
  };

  public getDisplayedRegroupement = (regroupement: number): string => {
    return "Regroupement : " + regroupement;
  };

  public getDisplayedDate = (date: string): string => {
    return "Date : le " + date;
  };

  public getDisplayedDateMin = (date: string): string => {
    return "Date : à partir du " + date;
  };

  public getDisplayedDateMax = (date: string): string => {
    return "Date : jusqu'au " + date;
  };

  public getDisplayedHeure = (heure: string): string => {
    return "Heure : " + heure;
  };

  public getDisplayedDuree = (duree: string): string => {
    return "Durée : " + duree;
  };

  public getDisplayedCommentaire = (commentaire: string): string => {
    return "Commentaire : " + commentaire;
  };

  public getDisplayEntityWithLabel = (
    entityName: string,
    entity: { libelle: string }
  ): string => {
    return entityName + " : " + entity.libelle;
  };

  public getDisplayEntityWithCodeAndLabel = (
    entityName: string,
    entity: EntiteAvecLibelleEtCode
  ): string => {
    return entityName + " : " + entity.libelle + " (" + entity.code + ")";
  };

  public getDisplayedChipValue = (option: SearchCriterion): string => {
    const object = option.object;
    switch (option.type) {
      case "observateur":
        return this.getDisplayEntityWithLabel("Observateur", object);
      case "associe":
        return this.getDisplayEntityWithLabel("Observateur associé", object);
      case "departement":
        return this.getDisplayedDepartement(object);
      case "commune":
        return this.getDisplayedCommune(object);
      case "lieuDit":
        return this.getDisplayedLieuDit(object);
      case "meteo":
        return this.getDisplayEntityWithLabel("Météo", object);
      case "classe":
        return this.getDisplayEntityWithLabel("Classe espèce", object);
      case "espece":
        return this.getDisplayedEspece(object);
      case "sexe":
        return this.getDisplayEntityWithLabel("Sexe", object);
      case "age":
        return this.getDisplayEntityWithLabel("Âge", object);
      case "estimationNombre":
        return this.getDisplayEntityWithLabel("Estimation du nombre", object);
      case "estimationDistance":
        return this.getDisplayEntityWithLabel(
          "Estimation de la distance",
          object
        );
      case "comportement":
        return this.getDisplayEntityWithCodeAndLabel("Comportement", object);
      case "milieu":
        return this.getDisplayEntityWithCodeAndLabel("Milieu", object);
      case "nicheur":
        return this.getDisplayedNicheur(object);
      case "id":
        return this.getDisplayedID(object);
      case "nombre":
        return this.getDisplayedNombre(object);
      case "temperature":
        return this.getDisplayedTemperature(object);
      case "distance":
        return this.getDisplayedDistance(object);
      case "regroupement":
        return this.getDisplayedRegroupement(object);
      case "date":
        return this.getDisplayedDate(object);
      case "dateMin":
        return this.getDisplayedDateMin(object);
      case "dateMax":
        return this.getDisplayedDateMax(object);
      case "heure":
        return this.getDisplayedHeure(object);
      case "duree":
        return this.getDisplayedDuree(object);
      case "commentaire":
        return this.getDisplayedCommentaire(object);
      default:
        return "ERREUR";
    }
  };

  public onMoreResultsClicked = (): void => { // TODO fix this somehow
    const newPage = this.pageNumber$.value + 1;
    this.pageNumber$.next(newPage);
    this.numberOfResultsPerType$.next(
      this.numberOfResultsPerType$.value +
      this.DEFAULT_NUMBER_OF_RESULTS_PER_TYPE
    );
  };

  private transformValue = (initialValue: string): string => {
    return deburr(initialValue.toLowerCase()).replace(
      this.CHARACTERS_TO_IGNORE,
      ""
    );
  };
}
