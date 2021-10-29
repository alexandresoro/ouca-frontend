import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ApolloQueryResult } from "@apollo/client/core";
import { Apollo, gql } from "apollo-angular";
import { DocumentNode } from "graphql";
import { SexesPaginatedResult, SexeWithCounts } from "src/app/model/graphql";
import { EntiteAvecLibelleTableComponent } from "../entite-avec-libelle-table/entite-avec-libelle-table.component";

type PaginatedSexesQueryResult = {
  paginatedSexes: SexesPaginatedResult
}

const PAGINATED_SEXES_QUERY = gql`
query PaginatedSexes($searchParams: SearchParams, $orderBy: EntitesAvecLibelleOrderBy, $sortOrder: SortOrder) {
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

@Component({
  selector: "sexe-table",
  styleUrls: [
    "../entite-avec-libelle-table/entite-avec-libelle-table.component.scss"
  ],
  templateUrl:
    "../entite-avec-libelle-table/entite-avec-libelle-table.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SexeTableComponent extends EntiteAvecLibelleTableComponent<SexeWithCounts, PaginatedSexesQueryResult> {
  constructor(
    apollo: Apollo
  ) {
    super(apollo);
  }

  protected getQuery(): DocumentNode {
    return PAGINATED_SEXES_QUERY;
  }

  protected onQueryResultValueChange = ({ data }: ApolloQueryResult<PaginatedSexesQueryResult>): void => {
    const ages = data?.paginatedSexes?.result ?? [];
    this.dataSource.updateValues(ages, data?.paginatedSexes?.count);
  }
}