import { Injectable } from "@angular/core";
import { gql, Query } from "apollo-angular";
import { DepartementsPaginatedResult, QueryPaginatedDepartementsArgs } from "../model/graphql";

@Injectable({
  providedIn: 'root',
})
export class DepartementsGetService extends Query<{ paginatedDepartements: DepartementsPaginatedResult }, QueryPaginatedDepartementsArgs> {
  document = gql`
    query Query($searchParams: SearchParams, $orderBy: DepartementsOrderBy, $sortOrder: SortOrder) {
      paginatedDepartements (searchParams: $searchParams, orderBy: $orderBy, sortOrder: $sortOrder) {
        count
        result {
          id
          code
          nbCommunes
          nbLieuxDits
          nbDonnees
        }
      }
    }
  `;
}