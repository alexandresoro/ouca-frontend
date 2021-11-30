import { ChangeDetectionStrategy, Component, OnDestroy } from "@angular/core";
import { Apollo, gql } from "apollo-angular";
import { Observable, Subject } from "rxjs";
import { map, takeUntil } from "rxjs/operators";
import { Classe, InputEspece } from "src/app/model/graphql";
import { CrossFieldErrorMatcher } from "src/app/modules/shared/matchers/cross-field-error.matcher";
import { EntitySubFormComponent } from "../entite-simple-form/entity-sub-form.component";

type EspeceFormQueryResult = {
  classes: Classe[]
}

const ESPECE_FORM_QUERY = gql`
  query {
    classes {
      id
      libelle
    }
  }
`;

@Component({
  selector: "espece-form",
  templateUrl: "./espece-form.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EspeceFormComponent extends EntitySubFormComponent<InputEspece & { id: number | null }> implements OnDestroy {

  private readonly destroy$ = new Subject();

  public classes$: Observable<Classe[]>;

  public especeCodeErrorStateMatcher = new CrossFieldErrorMatcher(
    "alreadyExistingCode"
  );

  public especeNomFrancaisErrorStateMatcher = new CrossFieldErrorMatcher(
    "alreadyExistingNomFrancais"
  );

  public especeNomLatinErrorStateMatcher = new CrossFieldErrorMatcher(
    "alreadyExistingNomLatin"
  );

  constructor(private apollo: Apollo) {
    super();
    this.classes$ = this.apollo.watchQuery<EspeceFormQueryResult>({
      query: ESPECE_FORM_QUERY
    }).valueChanges.pipe(
      takeUntil(this.destroy$),
      map(({ data }) => data?.classes)
    );
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
