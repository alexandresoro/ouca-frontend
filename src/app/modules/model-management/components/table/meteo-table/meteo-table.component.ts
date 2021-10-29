import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ApolloQueryResult } from "@apollo/client/core";
import { Apollo, gql } from "apollo-angular";
import { DocumentNode } from "graphql";
import { MeteosPaginatedResult, MeteoWithCounts } from "src/app/model/graphql";
import { EntiteAvecLibelleTableComponent } from "../entite-avec-libelle-table/entite-avec-libelle-table.component";

type PaginatedMeteosQueryResult = {
  paginatedMeteos: MeteosPaginatedResult
}

const PAGINATED_METEOS_QUERY = gql`
query PaginatedMeteos($searchParams: SearchParams, $orderBy: EntitesAvecLibelleOrderBy, $sortOrder: SortOrder) {
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


@Component({
  selector: "meteo-table",
  styleUrls: [
    "../entite-avec-libelle-table/entite-avec-libelle-table.component.scss"
  ],
  templateUrl:
    "../entite-avec-libelle-table/entite-avec-libelle-table.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeteoTableComponent extends EntiteAvecLibelleTableComponent<MeteoWithCounts, PaginatedMeteosQueryResult> {
  constructor(
    apollo: Apollo
  ) {
    super(apollo);
  }

  protected getQuery(): DocumentNode {
    return PAGINATED_METEOS_QUERY;
  }

  protected onQueryResultValueChange = ({ data }: ApolloQueryResult<PaginatedMeteosQueryResult>): void => {
    const ages = data?.paginatedMeteos?.result ?? [];
    this.dataSource.updateValues(ages, data?.paginatedMeteos?.count);
  }
}
