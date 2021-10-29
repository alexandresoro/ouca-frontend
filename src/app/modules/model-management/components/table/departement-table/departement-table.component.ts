import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ApolloQueryResult } from "@apollo/client/core";
import { Apollo, gql } from "apollo-angular";
import { DocumentNode } from "graphql";
import { DepartementsPaginatedResult, DepartementWithCounts } from "src/app/model/graphql";
import { EntiteTableComponent } from "../entite-table/entite-table.component";

type PaginatedDepartementsQueryResult = {
  paginatedDepartements: DepartementsPaginatedResult
}

const PAGINATED_DEPARTEMENTS_QUERY = gql`
query PaginatedDepartements($searchParams: SearchParams, $orderBy: DepartementsOrderBy, $sortOrder: SortOrder) {
  paginatedDepartements (searchParams: $searchParams, orderBy: $orderBy, sortOrder: $sortOrder) {
    count
    result {
      id
      code
      nbCommunes
      nbLieuxDits
      nbDonnees
    }
  }
}
`;

@Component({
  selector: "departement-table",
  styleUrls: ["./departement-table.component.scss"],
  templateUrl: "./departement-table.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartementTableComponent extends EntiteTableComponent<DepartementWithCounts, PaginatedDepartementsQueryResult> {
  public displayedColumns: string[] = [
    "code",
    "nbCommunes",
    "nbLieuxDits",
    "nbDonnees",
    "actions"
  ];

  constructor(
    apollo: Apollo
  ) {
    super(apollo);
  }

  protected getQuery(): DocumentNode {
    return PAGINATED_DEPARTEMENTS_QUERY;
  }

  protected onQueryResultValueChange = ({ data }: ApolloQueryResult<PaginatedDepartementsQueryResult>): void => {
    const departements = data?.paginatedDepartements?.result ?? [];
    this.dataSource.updateValues(departements, data?.paginatedDepartements?.count);
  }

}
