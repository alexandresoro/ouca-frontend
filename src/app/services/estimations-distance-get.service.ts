import { Injectable } from "@angular/core";
import { gql, Query } from "apollo-angular";
import { EstimationsDistancePaginatedResult, QueryPaginatedEstimationsDistanceArgs } from "../model/graphql";

@Injectable({
  providedIn: 'root',
})
export class EstimationsDistanceGetService extends Query<{ paginatedEstimationsDistance: EstimationsDistancePaginatedResult }, QueryPaginatedEstimationsDistanceArgs> {
  document = gql`
    query Query($searchParams: SearchParams, $orderBy: EntitesAvecLibelleOrderBy, $sortOrder: SortOrder) {
      paginatedEstimationsDistance (searchParams: $searchParams, orderBy: $orderBy, sortOrder: $sortOrder) {
        count
        result {
          id
          libelle
          nbDonnees
        }
      }
    }
  `;
}