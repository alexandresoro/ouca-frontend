import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ApolloQueryResult } from "@apollo/client/core";
import { Apollo, gql } from "apollo-angular";
import { DocumentNode } from "graphql";
import { EstimationNombreWithCounts, EstimationsNombrePaginatedResult } from "src/app/model/graphql";
import { EntiteTableComponent } from "../entite-table/entite-table.component";

type PaginatedEstimationsNombreQueryResult = {
  paginatedEstimationsNombre: EstimationsNombrePaginatedResult
}

const PAGINATED_ESTIMATIONS_NOMBRE_QUERY = gql`
  query PaginatedEstimationsNombre($searchParams: SearchParams, $orderBy: EstimationNombreOrderBy, $sortOrder: SortOrder) {
    paginatedEstimationsNombre (searchParams: $searchParams, orderBy: $orderBy, sortOrder: $sortOrder) {
      count
      result {
        id
        libelle
        nonCompte
        nbDonnees
      }
    }
  }
`;


@Component({
  selector: "estimation-nombre-table",
  styleUrls: ["./estimation-nombre-table.component.scss"],
  templateUrl: "./estimation-nombre-table.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EstimationNombreTableComponent extends EntiteTableComponent<EstimationNombreWithCounts, PaginatedEstimationsNombreQueryResult> {
  public displayedColumns: string[] = [
    "libelle",
    "nonCompte",
    "nbDonnees",
    "actions"
  ];

  constructor(
    apollo: Apollo
  ) {
    super(apollo);
  }

  protected getQuery(): DocumentNode {
    return PAGINATED_ESTIMATIONS_NOMBRE_QUERY;
  }

  protected onQueryResultValueChange = ({ data }: ApolloQueryResult<PaginatedEstimationsNombreQueryResult>): void => {
    const estimationsNombre = data?.paginatedEstimationsNombre?.result ?? [];
    this.dataSource.updateValues(estimationsNombre, data?.paginatedEstimationsNombre?.count);
  }

  public getNonCompte = (nonCompte: boolean): string => {
    return nonCompte ? "Oui" : "Non";
  };
}
