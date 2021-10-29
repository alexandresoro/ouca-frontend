import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ApolloQueryResult } from "@apollo/client/core";
import { Apollo, gql } from "apollo-angular";
import { DocumentNode } from "graphql";
import { EspecesOrderBy, EspecesPaginatedResult, EspeceWithCounts } from "src/app/model/graphql";
import { EntiteTableComponent } from "../entite-table/entite-table.component";

type PaginatedEspecesQueryResult = {
  paginatedEspeces: EspecesPaginatedResult
}

const PAGINATED_ESPECES_QUERY = gql`
  query PaginatedEspeces($searchParams: SearchParams, $orderBy: EspecesOrderBy, $sortOrder: SortOrder) {
    paginatedEspeces (searchParams: $searchParams, orderBy: $orderBy, sortOrder: $sortOrder) {
      count
      result {
        id
        code
        nomFrancais
        nomLatin
        nbDonnees
        classe {
          id
          libelle
        }
      }
    }
  }
`;

@Component({
  selector: "espece-table",
  styleUrls: ["./espece-table.component.scss"],
  templateUrl: "./espece-table.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EspeceTableComponent extends EntiteTableComponent<EspeceWithCounts, PaginatedEspecesQueryResult> {

  public displayedColumns: (EspecesOrderBy | "actions")[] = [
    "nomClasse",
    "code",
    "nomFrancais",
    "nomLatin",
    "nbDonnees",
    "actions"
  ];

  constructor(
    apollo: Apollo
  ) {
    super(apollo);
  }

  protected getQuery(): DocumentNode {
    return PAGINATED_ESPECES_QUERY;
  }

  protected onQueryResultValueChange = ({ data }: ApolloQueryResult<PaginatedEspecesQueryResult>): void => {
    const especes = data?.paginatedEspeces?.result ?? [];
    this.dataSource.updateValues(especes, data?.paginatedEspeces?.count);
  }

}
