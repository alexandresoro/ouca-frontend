import { Injectable } from "@angular/core";
import { gql, Query } from "apollo-angular";
import { CommunesPaginatedResult, QueryPaginatedCommunesArgs } from "../model/graphql";

@Injectable({
  providedIn: 'root',
})
export class CommunesGetService extends Query<{ paginatedCommunes: CommunesPaginatedResult }, QueryPaginatedCommunesArgs> {
  document = gql`
    query Query($searchParams: SearchParams, $orderBy: CommunesOrderBy, $sortOrder: SortOrder) {
      paginatedCommunes (searchParams: $searchParams, orderBy: $orderBy, sortOrder: $sortOrder) {
        count
        result {
          id
          code
          nom
          departement {
            id
            code
          }
          nbLieuxDits
          nbDonnees
        }
      }
    }
  `;
}