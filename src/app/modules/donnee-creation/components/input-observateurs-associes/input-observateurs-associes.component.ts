import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Observateur } from "src/app/model/graphql";

type InputObservateursAssociesQueryResult = {
  observateurs: Observateur[],
}

const INPUT_OBSERVATEURS_ASSOCIES_QUERY = gql`
  query {
    observateurs {
      id
      libelle
    }
  }
`;

@Component({
  selector: "input-observateurs-associes",
  templateUrl: "./input-observateurs-associes.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputObservateursAssociesComponent {
  @Input() public control: FormControl;

  public observateurs$: Observable<Observateur[]>;

  constructor(
    private apollo: Apollo,
  ) {
    this.observateurs$ = this.apollo.watchQuery<InputObservateursAssociesQueryResult>({
      query: INPUT_OBSERVATEURS_ASSOCIES_QUERY
    }).valueChanges.pipe(
      map(({ data }) => {
        return data?.observateurs;
      })
    );
  }
}
