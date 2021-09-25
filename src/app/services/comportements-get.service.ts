import { Injectable } from "@angular/core";
import { gql, Query } from "apollo-angular";
import { ComportementsPaginatedResult, QueryPaginatedComportementsArgs } from "../model/graphql";

@Injectable({
  providedIn: 'root',
})
export class ComportementsGetService extends Query<{ paginatedComportements: ComportementsPaginatedResult }, QueryPaginatedComportementsArgs> {
  document = gql`
    query Query($searchParams: SearchParams, $orderBy: ComportementsOrderBy, $sortOrder: SortOrder) {
      paginatedComportements (searchParams: $searchParams, orderBy: $orderBy, sortOrder: $sortOrder) {
        count
        result {
          id
          code
          libelle
          nicheur
          nbDonnees
        }
      }
    }
  `;
}