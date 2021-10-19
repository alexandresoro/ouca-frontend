import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatAutocomplete, MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { ApolloQueryResult } from "@apollo/client/core";
import { Apollo, gql } from "apollo-angular";
import deburr from 'lodash.deburr';
import { BehaviorSubject, combineLatest, Observable, Subject } from "rxjs";
import { map, startWith, takeUntil, withLatestFrom } from "rxjs/operators";
import { isADate } from "src/app/date-adapter/date-fns-adapter";
import { Age, Classe, Commune, Comportement, Departement, Espece, EstimationDistance, EstimationNombre, LieuDit, Meteo, Milieu, Observateur, Sexe } from "src/app/model/graphql";
import { EntiteAvecLibelleEtCode } from 'src/app/model/types/entite-avec-libelle-et-code.object';
import { EntiteAvecLibelle } from 'src/app/model/types/entite-avec-libelle.object';
import { Nicheur, NICHEUR_VALUES } from 'src/app/model/types/nicheur.model';
import { TimeHelper } from "src/app/modules/shared/helpers/time.helper";
import { SearchCriterion } from "../../models/search-criterion.model";
import { SearchCriteriaService } from "../../services/search-criteria.service";

type LieuDitSimple = Pick<LieuDit, 'id' | 'nom'> & {
  commune: {
    id: number
  }
};

type SearchQueryResult = {
  ages: Age[],
  classes: Classe[],
  communes: Commune[],
  comportements: Comportement[],
  departements: Departement[],
  especes: Espece[],
  lieuxDits: LieuDitSimple[],
  estimationsNombre: EstimationNombre[],
  estimationsDistance: EstimationDistance[],
  meteos: Meteo[],
  milieux: Milieu[],
  observateurs: Observateur[]
  sexes: Sexe[],
}

const SEARCH_QUERY = gql`
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
      commune {
        id
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

  public filteredObservateurs$: Observable<Observateur[]>;
  public filteredDepartements$: Observable<Departement[]>;
  public filteredCommunes$: Observable<Commune[]>;
  public filteredLieuxDits$: Observable<LieuDitSimple[]>;
  public filteredMeteos$: Observable<Meteo[]>;
  public filteredClasses$: Observable<Classe[]>;
  public filteredEspeces$: Observable<Espece[]>;
  public filteredSexes$: Observable<Sexe[]>;
  public filteredAges$: Observable<Age[]>;
  public filteredEstimationsNombre$: Observable<EstimationNombre[]>;
  public filteredEstimationsDistance$: Observable<EstimationDistance[]>;
  public filteredComportements$: Observable<Comportement[]>;
  public filteredMilieux$: Observable<Milieu[]>;
  public filteredNicheurs$: Observable<Nicheur[]>;
  public filteredOthers$: Observable<
    { type: string; object: string | number }[]
  >;

  private observateurs$: Observable<Observateur[]>;
  private classes$: Observable<Classe[]>;
  private especes$: Observable<Espece[]>;
  private estimationsNombre$: Observable<EstimationNombre[]>;
  private estimationsDistance$: Observable<EstimationDistance[]>;
  private sexes$: Observable<Sexe[]>;
  private ages$: Observable<Age[]>;
  private comportements$: Observable<Comportement[]>;
  private milieux$: Observable<Milieu[]>;
  private meteos$: Observable<Meteo[]>;
  private departements$: Observable<Departement[]>;
  private departementsSubj$: BehaviorSubject<Departement[]> = new BehaviorSubject<Departement[]>([]);
  private communes$: Observable<Commune[]>;

  private communesSubj$: BehaviorSubject<Commune[]> = new BehaviorSubject<Commune[]>([]);
  private lieuxDits$: Observable<LieuDitSimple[]>;
  private nicheursStatuses: Nicheur[] = Object.values(NICHEUR_VALUES);

  private CHARACTERS_TO_IGNORE = /(\s|\'|\-|\,)/g;

  private DEFAULT_NUMBER_OF_RESULTS_PER_TYPE = 10;
  private numberOfResultsPerType$ = new BehaviorSubject(
    this.DEFAULT_NUMBER_OF_RESULTS_PER_TYPE
  );

  private userInputChange$: Observable<[any, number]>;

  private readonly destroy$ = new Subject();

  private searchQuery$: Observable<ApolloQueryResult<SearchQueryResult>>;

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
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private init = (): void => {

    this.searchQuery$ = this.apollo.watchQuery<SearchQueryResult>({
      query: SEARCH_QUERY
    }).valueChanges.pipe(
      takeUntil(this.destroy$)
    );

    this.searchCriteria$ = this.searchCriteriaService.getCurrentSearchCriteria$();

    this.observateurs$ = this.searchQuery$.pipe(
      map(({ data }) => data?.observateurs)
    );
    this.estimationsNombre$ = this.searchQuery$.pipe(
      map(({ data }) => data?.estimationsNombre)
    );
    this.estimationsDistance$ = this.searchQuery$.pipe(
      map(({ data }) => data?.estimationsDistance)
    );
    this.classes$ = this.searchQuery$.pipe(
      map(({ data }) => data?.classes)
    );
    this.especes$ = this.searchQuery$.pipe(
      map(({ data }) => data?.especes)
    );
    this.sexes$ = this.searchQuery$.pipe(
      map(({ data }) => data?.sexes)
    );
    this.ages$ = this.searchQuery$.pipe(
      map(({ data }) => data?.ages)
    );
    this.comportements$ = this.searchQuery$.pipe(
      map(({ data }) => data?.comportements)
    );
    this.milieux$ = this.searchQuery$.pipe(
      map(({ data }) => data?.milieux)
    );
    this.meteos$ = this.searchQuery$.pipe(
      map(({ data }) => data?.meteos)
    );
    this.lieuxDits$ = this.searchQuery$.pipe(
      map(({ data }) => data?.lieuxDits)
    );
    this.departements$ = this.searchQuery$.pipe(
      map(({ data }) => data?.departements)
    );
    this.communes$ = this.searchQuery$.pipe(
      map(({ data }) => data?.communes)
    );

    this.departements$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(this.departementsSubj$);

    this.communes$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(this.communesSubj$);

    this.userInputChange$ = combineLatest(
      this.searchCtrl.valueChanges.pipe(startWith(null)),
      this.numberOfResultsPerType$
    );

    this.filteredObservateurs$ = this.userInputChange$.pipe(
      withLatestFrom(this.observateurs$),
      map(([[filterValue, listSize], allObservateurs]) =>
        this.filterEntitiesWithLabel(allObservateurs, listSize, filterValue)
      )
    );

    this.filteredDepartements$ = this.userInputChange$.pipe(
      withLatestFrom(this.departements$),
      map(([[filterValue, listSize], allDepartements]) =>
        this.filterDepartements(allDepartements, listSize, filterValue)
      )
    );

    this.filteredCommunes$ = this.userInputChange$.pipe(
      withLatestFrom(this.communes$),
      map(([[filterValue, listSize], allCommunes]) =>
        this.filterCommunes(allCommunes, listSize, filterValue)
      )
    );

    this.filteredLieuxDits$ = this.userInputChange$.pipe(
      withLatestFrom(this.lieuxDits$),
      map(([[filterValue, listSize], allLieuxDits]) =>
        this.filterLieuxDits(allLieuxDits, listSize, filterValue)
      )
    );

    this.filteredMeteos$ = this.userInputChange$.pipe(
      withLatestFrom(this.meteos$),
      map(([[filterValue, listSize], allMeteos]) =>
        this.filterEntitiesWithLabel(allMeteos, listSize, filterValue)
      )
    );

    this.filteredClasses$ = this.userInputChange$.pipe(
      withLatestFrom(this.classes$),
      map(([[filterValue, listSize], allClasses]) =>
        this.filterEntitiesWithLabel(allClasses, listSize, filterValue)
      )
    );

    this.filteredEspeces$ = this.userInputChange$.pipe(
      withLatestFrom(this.especes$),
      map(([[filterValue, listSize], allEspeces]) =>
        this.filterEspeces(allEspeces, listSize, filterValue)
      )
    );

    this.filteredSexes$ = this.userInputChange$.pipe(
      withLatestFrom(this.sexes$),
      map(([[filterValue, listSize], allSexes]) =>
        this.filterEntitiesWithLabel(allSexes, listSize, filterValue)
      )
    );

    this.filteredAges$ = this.userInputChange$.pipe(
      withLatestFrom(this.ages$),
      map(([[filterValue, listSize], allAges]) =>
        this.filterEntitiesWithLabel(allAges, listSize, filterValue)
      )
    );

    this.filteredEstimationsNombre$ = this.userInputChange$.pipe(
      withLatestFrom(this.estimationsNombre$),
      map(([[filterValue, listSize], allEstimations]) =>
        this.filterEntitiesWithLabel(allEstimations, listSize, filterValue)
      )
    );

    this.filteredEstimationsDistance$ = this.userInputChange$.pipe(
      withLatestFrom(this.estimationsDistance$),
      map(([[filterValue, listSize], allEstimations]) =>
        this.filterEntitiesWithLabel(allEstimations, listSize, filterValue)
      )
    );

    this.filteredComportements$ = this.userInputChange$.pipe(
      withLatestFrom(this.comportements$),
      map(([[filterValue, listSize], allComportements]) =>
        this.filterEntitiesWithLabelAndCode(
          allComportements,
          listSize,
          filterValue
        )
      )
    );

    this.filteredMilieux$ = this.userInputChange$.pipe(
      withLatestFrom(this.milieux$),
      map(([[filterValue, listSize], allMilieux]) =>
        this.filterEntitiesWithLabelAndCode(allMilieux, listSize, filterValue)
      )
    );

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

  private filterEntitiesWithLabel = <T extends EntiteAvecLibelle>(
    allEntities: T[],
    listSize: number,
    filterValue: any
  ): T[] => {
    if (filterValue && !filterValue.type) {
      const valueToFind = this.transformValue(filterValue);
      return allEntities
        .filter((entity) =>
          this.transformValue(entity.libelle).includes(valueToFind)
        )
        .slice(0, listSize);
    } else {
      return [];
    }
  };

  private filterEntitiesWithLabelAndCode = <T extends EntiteAvecLibelleEtCode>(
    allEntities: T[],
    listSize: number,
    filterValue: any
  ): T[] => {
    if (filterValue && !filterValue.type) {
      const valueToFind = this.transformValue(filterValue);
      return allEntities
        .filter(
          (entity) =>
            this.transformValue(entity.libelle).includes(valueToFind) ||
            this.transformValue(entity.code).startsWith(valueToFind)
        )
        .slice(0, listSize);
    } else {
      return [];
    }
  };

  private filterDepartements = (
    allDepartements: Departement[],
    listSize: number,
    filterValue: any
  ): Departement[] => {
    if (filterValue && !filterValue.type) {
      const valueToFind = this.transformValue(filterValue);

      return allDepartements
        .filter((departement) =>
          this.transformValue(departement.code).includes(valueToFind)
        )
        .slice(0, listSize);
    } else {
      return [];
    }
  };

  private filterCommunes = (
    allCommunes: Commune[],
    listSize: number,
    filterValue: any
  ): Commune[] => {
    if (filterValue && !filterValue.type) {
      const valueToFind = this.transformValue(filterValue);

      return allCommunes
        .filter((commune) =>
          this.transformValue(commune.nom).includes(valueToFind)
        )
        .slice(0, listSize);
    } else {
      return [];
    }
  };

  private filterLieuxDits = (
    allLieuxDits: LieuDitSimple[],
    listSize: number,
    filterValue: any
  ): LieuDitSimple[] => {
    if (filterValue && !filterValue.type) {
      const valueToFind = this.transformValue(filterValue);

      return allLieuxDits
        .filter((lieuDit) =>
          this.transformValue(lieuDit.nom).includes(valueToFind)
        )
        .slice(0, listSize);
    } else {
      return [];
    }
  };

  private filterEspeces = (
    allEspeces: Espece[],
    listSize: number,
    filterValue: any
  ): Espece[] => {
    if (filterValue && !filterValue.type) {
      const valueToFind = this.transformValue(filterValue);
      return allEspeces
        .filter(
          (espece) =>
            this.transformValue(espece.code).includes(valueToFind) ||
            this.transformValue(espece.nomFrancais).includes(valueToFind) ||
            this.transformValue(espece.nomLatin).includes(valueToFind)
        )
        .slice(0, listSize);
    } else {
      return [];
    }
  };

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

  public getDisplayedDepartement = (departement: Departement): string => {
    return "Département : " + departement.code;
  };

  public getDisplayedCommune = (commune: Commune): string => {
    const departementCode = this.departementsSubj$.value?.find(departement => departement.id === commune?.departement?.id)?.code;
    return `Commune : ${commune.nom} (${departementCode})`;
  };

  public getDisplayedLieuDit = (lieuDit: LieuDitSimple): string => {
    const commune = this.communesSubj$.value?.find(commune => commune.id === lieuDit.commune?.id);
    return `Lieu-dit : ${lieuDit.nom} à ${this.getDisplayedCommune(commune)}`;
  };

  public getDisplayedEspece = (espece: Espece): string => {
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
    entity: EntiteAvecLibelle
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

  public onMoreResultsClicked = (): void => {
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
