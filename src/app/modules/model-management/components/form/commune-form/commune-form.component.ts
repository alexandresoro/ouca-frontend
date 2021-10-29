import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Departement, InputCommune } from "src/app/model/graphql";
import { CrossFieldErrorMatcher } from "src/app/modules/shared/matchers/cross-field-error.matcher";
import { EntitySubFormComponent } from "../entite-simple-form/entity-sub-form.component";

type CommuneFormQueryResult = {
  departements: Departement[]
}

const COMMUNE_FORM_QUERY = gql`
  query {
    departements {
      id
      code
    }
  }
`;

@Component({
  selector: "commune-form",
  templateUrl: "./commune-form.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommuneFormComponent extends EntitySubFormComponent<InputCommune & { id: number | null }> {
  public departements$: Observable<Departement[]>;

  public communeCodeErrorStateMatcher = new CrossFieldErrorMatcher(
    "alreadyExistingCode"
  );

  public communeNomErrorStateMatcher = new CrossFieldErrorMatcher(
    "alreadyExistingNom"
  );

  constructor(private apollo: Apollo) {
    super();
    this.departements$ = this.apollo.watchQuery<CommuneFormQueryResult>({
      query: COMMUNE_FORM_QUERY
    }).valueChanges.pipe(
      map(({ data }) => {
        return data?.departements;
      })
    );
  }
}
