import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ApolloQueryResult } from "@apollo/client/core";
import { Apollo, gql } from "apollo-angular";
import { DocumentNode } from "graphql";
import { ComportementsPaginatedResult, ComportementWithCounts, Nicheur } from "src/app/model/graphql";
import { NICHEUR_VALUES } from "src/app/model/types/nicheur.model";
import { EntiteTableComponent } from "../entite-table/entite-table.component";

type PaginatedComportementsQueryResult = {
  paginatedComportements: ComportementsPaginatedResult
}

const PAGINATED_COMPORTEMENTS_QUERY = gql`
  query PaginatedComportements($searchParams: SearchParams, $orderBy: ComportementsOrderBy, $sortOrder: SortOrder) {
    paginatedComportements (searchParams: $searchParams, orderBy: $orderBy, sortOrder: $sortOrder) {
      count
      result {
        id
        code
        libelle
        nicheur
        nbDonnees
      }
    }
  }
`;

@Component({
  selector: "comportement-table",
  styleUrls: ["./comportement-table.component.scss"],
  templateUrl: "./comportement-table.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComportementTableComponent extends EntiteTableComponent<ComportementWithCounts, PaginatedComportementsQueryResult> {
  public displayedColumns: (string)[] = [
    "code",
    "libelle",
    "nicheur",
    "nbDonnees",
    "actions"
  ];

  constructor(
    apollo: Apollo
  ) {
    super(apollo);
  }

  protected getQuery(): DocumentNode {
    return PAGINATED_COMPORTEMENTS_QUERY;
  }

  protected onQueryResultValueChange = ({ data }: ApolloQueryResult<PaginatedComportementsQueryResult>): void => {
    const communes = data?.paginatedComportements?.result ?? [];
    this.dataSource.updateValues(communes, data?.paginatedComportements?.count);
  }

  public getNicheur = (code: Nicheur): string => {
    return !code ? "" : NICHEUR_VALUES[code].name;
  };

}
