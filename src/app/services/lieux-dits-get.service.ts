import { Injectable } from "@angular/core";
import { gql, Query } from "apollo-angular";
import { LieuxDitsPaginatedResult, QueryPaginatedLieuxditsArgs } from "../model/graphql";

@Injectable({
  providedIn: 'root',
})
export class LieuxDitsGetService extends Query<{ paginatedLieuxdits: LieuxDitsPaginatedResult }, QueryPaginatedLieuxditsArgs> {
  document = gql`
    query Query($searchParams: SearchParams, $orderBy: LieuxDitsOrderBy, $sortOrder: SortOrder) {
      paginatedLieuxdits (searchParams: $searchParams, orderBy: $orderBy, sortOrder: $sortOrder) {
        count
        result {
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
          nbDonnees
        }
      }
    }
  `;
}