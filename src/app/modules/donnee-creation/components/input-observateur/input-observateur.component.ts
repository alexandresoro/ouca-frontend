import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Apollo, gql } from "apollo-angular";
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { FindParams, Observateur } from "src/app/model/graphql";
import autocompleteUpdaterObservable from "src/app/modules/shared/helpers/autocomplete-updater-observable";

const OBSERVATEURS_QUERY = gql`
  query Observateurs($params: FindParams) {
    observateurs(params: $params) {
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
export class InputObservateurComponent implements OnInit {
  @Input() public control: FormControl;

  @Input() public placeholder?: string = "Observateur";

  public matchingObservateurs$: Observable<Observateur[]>;

  constructor(
    private apollo: Apollo
  ) { }

  ngOnInit(): void {
    this.matchingObservateurs$ = autocompleteUpdaterObservable(this.control, (value: string) => {
      return this.apollo.query<{ observateurs: Observateur[] }, { params: FindParams }>({
        query: OBSERVATEURS_QUERY,
        variables: {
          params: {
            q: value
          }
        }
      }).pipe(
        map(({ data }) => data?.observateurs)
      )
    });
  }

  public displayObservateurFormat = (observateur: Observateur): string => {
    return observateur?.libelle ?? null;
  };
}
