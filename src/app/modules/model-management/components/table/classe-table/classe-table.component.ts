import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ApolloQueryResult } from "@apollo/client/core";
import { Apollo, gql } from "apollo-angular";
import { DocumentNode } from "graphql";
import { ClassesOrderBy, ClassesPaginatedResult, ClasseWithCounts } from "src/app/model/graphql";
import { EntiteTableComponent } from "../entite-table/entite-table.component";

type PaginatedClassesQueryResult = {
  paginatedClasses: ClassesPaginatedResult
}

const PAGINATED_CLASSES_QUERY = gql`
query PaginatedClasses($searchParams: SearchParams, $orderBy: ClassesOrderBy, $sortOrder: SortOrder) {
  paginatedClasses (searchParams: $searchParams, orderBy: $orderBy, sortOrder: $sortOrder) {
    count
    result {
      id
      libelle
      nbEspeces
      nbDonnees
    }
  }
}
`;

@Component({
  selector: "classe-table",
  styleUrls: [
    "../entite-avec-libelle-table/entite-avec-libelle-table.component.scss",
    "./classe-table.component.scss"
  ],
  templateUrl: "./classe-table.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClasseTableComponent extends EntiteTableComponent<ClasseWithCounts, PaginatedClassesQueryResult> {

  public displayedColumns: (ClassesOrderBy | string)[] = [
    "libelle",
    "nbEspeces",
    "nbDonnees",
    "actions"
  ];

  constructor(
    apollo: Apollo
  ) {
    super(apollo);
  }

  protected getQuery(): DocumentNode {
    return PAGINATED_CLASSES_QUERY;
  }

  protected onQueryResultValueChange = ({ data }: ApolloQueryResult<PaginatedClassesQueryResult>): void => {
    const classes = data?.paginatedClasses?.result ?? [];
    this.dataSource.updateValues(classes, data?.paginatedClasses?.count);
  }
}
