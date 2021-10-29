import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ApolloQueryResult } from "@apollo/client/core";
import { Apollo, gql } from "apollo-angular";
import { DocumentNode } from "graphql";
import { EstimationDistanceWithCounts, EstimationsDistancePaginatedResult } from "src/app/model/graphql";
import { EntiteAvecLibelleTableComponent } from "../entite-avec-libelle-table/entite-avec-libelle-table.component";

type PaginatedEstimationsDistanceQueryResult = {
  paginatedEstimationsDistance: EstimationsDistancePaginatedResult
}

const PAGINATED_ESTIMATIONS_DISTANCE_QUERY = gql`
query PaginatedEstimationsDistance($searchParams: SearchParams, $orderBy: EntitesAvecLibelleOrderBy, $sortOrder: SortOrder) {
  paginatedEstimationsDistance (searchParams: $searchParams, orderBy: $orderBy, sortOrder: $sortOrder) {
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
  selector: "estimation-distance-table",
  styleUrls: [
    "../entite-avec-libelle-table/entite-avec-libelle-table.component.scss"
  ],
  templateUrl:
    "../entite-avec-libelle-table/entite-avec-libelle-table.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EstimationDistanceTableComponent extends EntiteAvecLibelleTableComponent<EstimationDistanceWithCounts, PaginatedEstimationsDistanceQueryResult> {
  constructor(
    apollo: Apollo
  ) {
    super(apollo);
  }

  protected getQuery(): DocumentNode {
    return PAGINATED_ESTIMATIONS_DISTANCE_QUERY;
  }

  protected onQueryResultValueChange = ({ data }: ApolloQueryResult<PaginatedEstimationsDistanceQueryResult>): void => {
    const estimationsDistance = data?.paginatedEstimationsDistance?.result ?? [];
    this.dataSource.updateValues(estimationsDistance, data?.paginatedEstimationsDistance?.count);
  }
}
