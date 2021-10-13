import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Age, QueryAgesArgs } from "src/app/model/graphql";
import autocompleteUpdaterObservable from "src/app/modules/shared/helpers/autocomplete-updater-observable";

type AgesQueryResult = {
  ages: Age[],
}

const INPUT_AGES_QUERY = gql`
  query Ages($params: FindParams) {
    ages(params: $params) {
      id
      libelle
    }
  }
`;

@Component({
  selector: "input-age",
  templateUrl: "./input-age.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputAgeComponent implements OnInit {
  @Input() public control: FormControl;

  public matchingAges$: Observable<Age[]>;

  constructor(
    private apollo: Apollo,
  ) {
  }

  ngOnInit(): void {
    this.matchingAges$ = autocompleteUpdaterObservable(this.control, (value: string) => {
      return this.apollo.query<AgesQueryResult, QueryAgesArgs>({
        query: INPUT_AGES_QUERY,
        variables: {
          params: {
            q: value
          }
        }
      }).pipe(
        map(({ data }) => data?.ages)
      )
    });
  }

  public displayAgeFormat = (age: Age): string => {
    return age?.libelle ?? null;
  };
}
