import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { getFormattedDateStringFromString } from "src/app/date-adapter/date-fns-adapter";
import { Nicheur, SearchDonneeCriteria } from "src/app/model/graphql";
import { SearchCriterion } from "../models/search-criterion.model";

@Injectable({
  providedIn: "root"
})
export class SearchCriteriaService {
  private searchCriteria$: BehaviorSubject<
    SearchCriterion[]
  > = new BehaviorSubject<SearchCriterion[]>([]);

  public addCriterion = (criterion: SearchCriterion): void => {
    const newCriteria = [].concat(this.searchCriteria$.value, criterion);
    this.searchCriteria$.next(newCriteria);
  };

  public removeCriterion = (criterion: SearchCriterion): void => {
    const index = this.searchCriteria$.value.indexOf(criterion);
    if (index >= 0) {
      const newSearchCriteria = [].concat(this.searchCriteria$.value);
      newSearchCriteria.splice(index, 1);
      this.searchCriteria$.next(newSearchCriteria);
    }
  };

  public getCurrentSearchCriteria$ = (): Observable<SearchCriterion[]> => {
    return this.searchCriteria$.asObservable();
  };

  public getCurrentSearchDonneeCriteria$ = (): Observable<SearchDonneeCriteria> => {
    return this.searchCriteria$.pipe(
      map(this.buildSearchDonneeCriteriaFromSearchCriteria)
    )
  }

  public getCurrentSearchCriteria = (): SearchCriterion[] => {
    return this.searchCriteria$.value;
  };

  private buildSearchDonneeCriteriaFromSearchCriteria = (options: SearchCriterion[]): SearchDonneeCriteria => {

    const searchCriteria: SearchDonneeCriteria = {};

    const observateurs: number[] = [];
    const associes: number[] = [];
    const departements: number[] = [];
    const communes: number[] = [];
    const lieuxdits: number[] = [];
    const meteos: number[] = [];
    const classes: number[] = [];
    const especes: number[] = [];
    const estimationsNombre: number[] = [];
    const estimationsDistance: number[] = [];
    const comportements: number[] = [];
    const milieux: number[] = [];
    const ages: number[] = [];
    const sexes: number[] = [];
    const nicheurs: Nicheur[] = [];

    if (options) {
      for (const option of options) {
        const object = option.object;
        switch (option.type) {
          case "id":
            searchCriteria.id = object;
            break;
          case "observateur":
            observateurs.push(object.id);
            break;
          case "associe":
            associes.push(object.id);
            break;
          case "date":
            searchCriteria.fromDate = getFormattedDateStringFromString(object);
            searchCriteria.toDate = getFormattedDateStringFromString(object);
            break;
          case "dateMin":
            searchCriteria.fromDate = getFormattedDateStringFromString(object);
            break;
          case "dateMax":
            searchCriteria.toDate = getFormattedDateStringFromString(object);
            break;
          case "heure":
            searchCriteria.heure = object;
            break;
          case "duree":
            searchCriteria.duree = object;
            break;
          case "departement":
            departements.push(object.id);
            break;
          case "commune":
            communes.push(object.id);
            break;
          case "lieuDit":
            lieuxdits.push(object.id);
            break;
          case "temperature":
            searchCriteria.temperature = +object;
            break;
          case "meteo":
            meteos.push(object.id);
            break;
          case "classe":
            classes.push(object.id);
            break;
          case "espece":
            especes.push(object.id);
            break;
          case "sexe":
            sexes.push(object.id);
            break;
          case "age":
            ages.push(object.id);
            break;
          case "nombre":
            searchCriteria.nombre = +object;
            break;
          case "estimationNombre":
            estimationsNombre.push(object.id);
            break;
          case "distance":
            searchCriteria.distance = +object;
            break;
          case "estimationDistance":
            estimationsDistance.push(object.id);
            break;
          case "regroupement":
            searchCriteria.regroupement = +object;
            break;
          case "comportement":
            comportements.push(object.id);
            break;
          case "milieu":
            milieux.push(object.id);
            break;
          case "nicheur":
            nicheurs.push(object.id);
            break;
          case "commentaire":
            searchCriteria.commentaire = object;
            break;
        }
      }
    }

    return {
      ...searchCriteria,
      ...(observateurs.length ? { observateurs } : {}),
      ...(associes.length ? { associes } : {}),
      ...(departements.length ? { departements } : {}),
      ...(communes.length ? { communes } : {}),
      ...(lieuxdits.length ? { lieuxdits } : {}),
      ...(meteos.length ? { meteos } : {}),
      ...(classes.length ? { classes } : {}),
      ...(especes.length ? { especes } : {}),
      ...(estimationsNombre.length ? { estimationsNombre } : {}),
      ...(estimationsDistance.length ? { estimationsDistance } : {}),
      ...(comportements.length ? { comportements } : {}),
      ...(milieux.length ? { milieux } : {}),
      ...(ages.length ? { ages } : {}),
      ...(sexes.length ? { sexes } : {}),
      ...(nicheurs.length ? { nicheurs } : {})
    };
  };

}
