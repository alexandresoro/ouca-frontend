import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ApolloQueryResult } from "@apollo/client/core";
import { Apollo, gql } from "apollo-angular";
import { DocumentNode } from "graphql";
import { AgesPaginatedResult, AgeWithCounts } from "src/app/model/graphql";
import { EntiteAvecLibelleTableComponent } from "../entite-avec-libelle-table/entite-avec-libelle-table.component";

type PaginatedAgesQueryResult = {
  paginatedAges: AgesPaginatedResult
}

const PAGINATED_AGES_QUERY = gql`
query PaginatedAges($searchParams: SearchParams, $orderBy: EntitesAvecLibelleOrderBy, $sortOrder: SortOrder) {
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

@Component({
  selector: "age-table",
  styleUrls: [
    "../entite-avec-libelle-table/entite-avec-libelle-table.component.scss"
  ],
  templateUrl:
    "../entite-avec-libelle-table/entite-avec-libelle-table.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgeTableComponent extends EntiteAvecLibelleTableComponent<AgeWithCounts, PaginatedAgesQueryResult> {

  constructor(
    apollo: Apollo
  ) {
    super(apollo);
  }

  protected getQuery(): DocumentNode {
    return PAGINATED_AGES_QUERY;
  }

  protected onQueryResultValueChange = ({ data }: ApolloQueryResult<PaginatedAgesQueryResult>): void => {
    const ages = data?.paginatedAges?.result ?? [];
    this.dataSource.updateValues(ages, data?.paginatedAges?.count);
  }

}
