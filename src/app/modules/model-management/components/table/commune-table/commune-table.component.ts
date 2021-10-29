import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ApolloQueryResult } from "@apollo/client/core";
import { Apollo, gql } from "apollo-angular";
import { DocumentNode } from "graphql";
import { CommunesPaginatedResult, CommuneWithCounts } from "src/app/model/graphql";
import { EntiteTableComponent } from "../entite-table/entite-table.component";

type PaginatedCommunesQueryResult = {
  paginatedCommunes: CommunesPaginatedResult
}

const PAGINATED_COMMUNES_QUERY = gql`
  query PaginatedCommunes($searchParams: SearchParams, $orderBy: CommunesOrderBy, $sortOrder: SortOrder) {
    paginatedCommunes (searchParams: $searchParams, orderBy: $orderBy, sortOrder: $sortOrder) {
      count
      result {
        id
        code
        nom
        departement {
          id
          code
        }
        nbLieuxDits
        nbDonnees
      }
    }
  }
`;

@Component({
  selector: "commune-table",
  styleUrls: ["./commune-table.component.scss"],
  templateUrl: "./commune-table.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommuneTableComponent extends EntiteTableComponent<CommuneWithCounts, PaginatedCommunesQueryResult> {
  public displayedColumns: string[] = [
    "departement",
    "code",
    "nom",
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
    return PAGINATED_COMMUNES_QUERY;
  }

  protected onQueryResultValueChange = ({ data }: ApolloQueryResult<PaginatedCommunesQueryResult>): void => {
    const communes = data?.paginatedCommunes?.result ?? [];
    this.dataSource.updateValues(communes, data?.paginatedCommunes?.count);
  }

}
