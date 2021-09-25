import { Injectable } from "@angular/core";
import { gql, Query } from "apollo-angular";
import { AgesPaginatedResult, QueryPaginatedAgesArgs } from "../model/graphql";

@Injectable({
  providedIn: 'root',
})
export class AgesPaginatedService extends Query<{ paginatedAges: AgesPaginatedResult }, QueryPaginatedAgesArgs> {
  document = gql`
    query Query($searchParams: SearchParams, $orderBy: EntitesAvecLibelleOrderBy, $sortOrder: SortOrder) {
      paginatedAges (searchParams: $searchParams, orderBy: $orderBy, sortOrder: $sortOrder) {
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