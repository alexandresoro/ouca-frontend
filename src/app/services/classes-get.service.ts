import { Injectable } from "@angular/core";
import { gql, Query } from "apollo-angular";
import { ClassesPaginatedResult, QueryPaginatedClassesArgs } from "../model/graphql";

@Injectable({
  providedIn: 'root',
})
export class ClassesGetService extends Query<{ paginatedClasses: ClassesPaginatedResult }, QueryPaginatedClassesArgs> {
  document = gql`
    query Query($searchParams: SearchParams, $orderBy: ClassesOrderBy, $sortOrder: SortOrder) {
      paginatedClasses (searchParams: $searchParams, orderBy: $orderBy, sortOrder: $sortOrder) {
        count
        result {
          id
          libelle
          nbEspeces
          nbDonnees
        }
      }
    }
  `;
}