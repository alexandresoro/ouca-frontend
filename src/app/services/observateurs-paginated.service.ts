import { Injectable } from "@angular/core";
import { gql, Query } from "apollo-angular";
import { ObservateursPaginatedResult, QueryPaginatedObservateursArgs } from "../model/graphql";

@Injectable({
  providedIn: 'root',
})
export class ObservateursPaginatedService extends Query<{ paginatedObservateurs: ObservateursPaginatedResult }, QueryPaginatedObservateursArgs> {
  document = gql`
    query Query($searchParams: SearchParams, $orderBy: EntitesAvecLibelleOrderBy, $sortOrder: SortOrder) {
      paginatedObservateurs (searchParams: $searchParams, orderBy: $orderBy, sortOrder: $sortOrder) {
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