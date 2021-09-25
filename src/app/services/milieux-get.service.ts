import { Injectable } from "@angular/core";
import { gql, Query } from "apollo-angular";
import { MilieuxPaginatedResult, QueryPaginatedMilieuxArgs } from "../model/graphql";

@Injectable({
  providedIn: 'root',
})
export class MilieuxGetService extends Query<{ paginatedMilieux: MilieuxPaginatedResult }, QueryPaginatedMilieuxArgs> {
  document = gql`
    query Query($searchParams: SearchParams, $orderBy: MilieuxOrderBy, $sortOrder: SortOrder) {
      paginatedMilieux (searchParams: $searchParams, orderBy: $orderBy, sortOrder: $sortOrder) {
        count
        result {
          id
          code
          libelle
          nbDonnees
        }
      }
    }
  `;
}