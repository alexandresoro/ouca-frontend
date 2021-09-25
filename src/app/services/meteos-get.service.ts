import { Injectable } from "@angular/core";
import { gql, Query } from "apollo-angular";
import { MeteosPaginatedResult, QueryPaginatedMeteosArgs } from "../model/graphql";

@Injectable({
  providedIn: 'root',
})
export class MeteosGetService extends Query<{ paginatedMeteos: MeteosPaginatedResult }, QueryPaginatedMeteosArgs> {
  document = gql`
    query Query($searchParams: SearchParams, $orderBy: EntitesAvecLibelleOrderBy, $sortOrder: SortOrder) {
      paginatedMeteos (searchParams: $searchParams, orderBy: $orderBy, sortOrder: $sortOrder) {
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