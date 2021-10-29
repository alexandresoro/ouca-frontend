import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ApolloQueryResult } from "@apollo/client/core";
import { Apollo, gql } from "apollo-angular";
import { DocumentNode } from "graphql";
import { MilieuWithCounts, MilieuxOrderBy, MilieuxPaginatedResult } from "src/app/model/graphql";
import { EntiteTableComponent } from "../entite-table/entite-table.component";

type PaginatedMilieuxQueryResult = {
  paginatedMilieux: MilieuxPaginatedResult
}

const PAGINATED_MILIEUX_QUERY = gql`
  query PaginatedMilieux($searchParams: SearchParams, $orderBy: MilieuxOrderBy, $sortOrder: SortOrder) {
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

@Component({
  selector: "milieu-table",
  styleUrls: ["./milieu-table.component.scss"],
  templateUrl: "./milieu-table.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MilieuTableComponent extends EntiteTableComponent<MilieuWithCounts, PaginatedMilieuxQueryResult> {

  public displayedColumns: (MilieuxOrderBy | string)[] = [
    "code",
    "libelle",
    "nbDonnees",
    "actions"
  ];

  constructor(
    apollo: Apollo
  ) {
    super(apollo);
  }

  protected getQuery(): DocumentNode {
    return PAGINATED_MILIEUX_QUERY;
  }

  protected onQueryResultValueChange = ({ data }: ApolloQueryResult<PaginatedMilieuxQueryResult>): void => {
    const communes = data?.paginatedMilieux?.result ?? [];
    this.dataSource.updateValues(communes, data?.paginatedMilieux?.count);
  }
}
