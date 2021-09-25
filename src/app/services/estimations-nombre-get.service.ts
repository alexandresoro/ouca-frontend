import { Injectable } from "@angular/core";
import { gql, Query } from "apollo-angular";
import { EstimationsNombrePaginatedResult, QueryPaginatedEstimationsNombreArgs } from "../model/graphql";

@Injectable({
  providedIn: 'root',
})
export class EstimationsNombreGetService extends Query<{ paginatedEstimationsNombre: EstimationsNombrePaginatedResult }, QueryPaginatedEstimationsNombreArgs> {
  document = gql`
    query Query($searchParams: SearchParams, $orderBy: EstimationNombreOrderBy, $sortOrder: SortOrder) {
      paginatedEstimationsNombre (searchParams: $searchParams, orderBy: $orderBy, sortOrder: $sortOrder) {
        count
        result {
          id
          libelle
          nonCompte
          nbDonnees
        }
      }
    }
  `;
}