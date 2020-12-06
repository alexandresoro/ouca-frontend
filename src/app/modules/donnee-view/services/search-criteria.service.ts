import { Injectable } from "@angular/core";
import * as _ from "lodash";
import { BehaviorSubject, Observable } from "rxjs";
import { SearchCriterion } from "../models/search-criterion.model";

@Injectable({
  providedIn: "root"
})
export class SearchCriteriaService {
  private searchCriteria$: BehaviorSubject<
    SearchCriterion[]
  > = new BehaviorSubject([]);

  public addCriterion = (criterion: SearchCriterion): void => {
    const newCriteria = _.concat(this.searchCriteria$.value, criterion);
    this.searchCriteria$.next(newCriteria);
  };

  public removeCriterion = (criterion: SearchCriterion): void => {
    const index = this.searchCriteria$.value.indexOf(criterion);
    if (index >= 0) {
      const newSearchCriteria = _.concat([], this.searchCriteria$.value);
      newSearchCriteria.splice(index, 1);
      this.searchCriteria$.next(newSearchCriteria);
    }
  };

  public getCurrentSearchCriteria$ = (): Observable<SearchCriterion[]> => {
    return this.searchCriteria$.asObservable();
  };

  public getCurrentSearchCriteria = (): SearchCriterion[] => {
    return this.searchCriteria$.value;
  };
}
