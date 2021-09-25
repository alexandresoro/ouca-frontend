import { Injectable } from "@angular/core";
import { gql, Query } from "apollo-angular";
import { QueryPaginatedSexesArgs, SexesPaginatedResult } from "../model/graphql";

@Injectable({
  providedIn: 'root',
})
export class SexesGetService extends Query<{ paginatedSexes: SexesPaginatedResult }, QueryPaginatedSexesArgs> {
  document = gql`
    query Query($searchParams: SearchParams, $orderBy: EntitesAvecLibelleOrderBy, $sortOrder: SortOrder) {
      paginatedSexes (searchParams: $searchParams, orderBy: $orderBy, sortOrder: $sortOrder) {
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