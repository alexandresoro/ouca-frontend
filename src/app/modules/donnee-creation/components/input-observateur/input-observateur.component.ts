import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Apollo, gql } from "apollo-angular";
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { Observateur } from "src/app/model/graphql";
import { AutocompleteAttribute } from "../../../shared/components/autocomplete/autocomplete-attribute.object";

type InputObservateursQueryResult = {
  observateurs: Observateur[],
}

const INPUT_OBSERVATEURS_QUERY = gql`
  query {
    observateurs {
      id
      libelle
    }
  }
`;

@Component({
  selector: "input-observateur",
  templateUrl: "./input-observateur.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputObservateurComponent {
  @Input() public control: FormControl;

  @Input() public placeholder?: string = "Observateur";

  public observateurs$: Observable<Observateur[]>;

  constructor(
    private apollo: Apollo,
  ) {
    this.observateurs$ = this.apollo.watchQuery<InputObservateursQueryResult>({
      query: INPUT_OBSERVATEURS_QUERY
    }).valueChanges.pipe(
      map(({ data }) => {
        return data?.observateurs;
      })
    );
  }

  public autocompleteAttributes: AutocompleteAttribute[] = [
    {
      key: "libelle",
      exactSearchMode: false,
      startWithMode: false
    }
  ];

  public displayObservateurFormat = (observateur: Observateur): string => {
    return observateur?.libelle ?? null;
  };
}
