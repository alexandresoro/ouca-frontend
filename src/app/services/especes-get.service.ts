import { Injectable } from "@angular/core";
import { gql, Query } from "apollo-angular";
import { EspecesPaginatedResult, QueryPaginatedEspecesArgs } from "../model/graphql";

@Injectable({
  providedIn: 'root',
})
export class EspecesGetService extends Query<{ paginatedEspeces: EspecesPaginatedResult }, QueryPaginatedEspecesArgs> {
  document = gql`
    query Query($searchParams: SearchParams, $orderBy: EspecesOrderBy, $sortOrder: SortOrder) {
      paginatedEspeces (searchParams: $searchParams, orderBy: $orderBy, sortOrder: $sortOrder) {
        count
        result {
          id
          code
          nomFrancais
          nomLatin
          nbDonnees
          classe {
            id
            libelle
          }
        }
      }
    }
  `;
}