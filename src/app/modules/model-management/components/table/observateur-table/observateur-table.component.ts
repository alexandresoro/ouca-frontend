import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ApolloQueryResult } from "@apollo/client/core";
import { Apollo, gql } from "apollo-angular";
import { DocumentNode } from "graphql";
import { ObservateursPaginatedResult, ObservateurWithCounts } from "src/app/model/graphql";
import { EntiteAvecLibelleTableComponent } from "../entite-avec-libelle-table/entite-avec-libelle-table.component";

type PaginatedObservateursQueryResult = {
  paginatedObservateurs: ObservateursPaginatedResult
}

const PAGINATED_OBSERVATEURS_QUERY = gql`
  query PaginatedObservateurs($searchParams: SearchParams, $orderBy: EntitesAvecLibelleOrderBy, $sortOrder: SortOrder) {
    paginatedObservateurs(searchParams: $searchParams, orderBy: $orderBy, sortOrder: $sortOrder) {
      count
      result {
        id
        libelle
        nbDonnees
      }
    }
  }
`;

@Component({
  selector: "observateur-table",
  styleUrls: [
    "../entite-avec-libelle-table/entite-avec-libelle-table.component.scss"
  ],
  templateUrl:
    "../entite-avec-libelle-table/entite-avec-libelle-table.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObservateurTableComponent extends EntiteAvecLibelleTableComponent<ObservateurWithCounts, PaginatedObservateursQueryResult> {
  constructor(
    apollo: Apollo
  ) {
    super(apollo);
  }

  protected getQuery(): DocumentNode {
    return PAGINATED_OBSERVATEURS_QUERY;
  }

  protected onQueryResultValueChange = ({ data }: ApolloQueryResult<PaginatedObservateursQueryResult>): void => {
    const ages = data?.paginatedObservateurs?.result ?? [];
    this.dataSource.updateValues(ages, data?.paginatedObservateurs?.count);
  }
}
