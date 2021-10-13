import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { QuerySexesArgs, Sexe } from "src/app/model/graphql";
import autocompleteUpdaterObservable from "src/app/modules/shared/helpers/autocomplete-updater-observable";

type SexesQueryResult = {
  sexes: Sexe[],
}

const INPUT_SEXES_QUERY = gql`
  query Sexes($params: FindParams) {
    sexes(params: $params) {
      id
      libelle
    }
  }
`;

@Component({
  selector: "input-sexe",
  templateUrl: "./input-sexe.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputSexeComponent implements OnInit {
  @Input() public control: FormControl;

  public matchingSexes$: Observable<Sexe[]>;

  constructor(
    private apollo: Apollo,
  ) {
  }

  ngOnInit(): void {
    this.matchingSexes$ = autocompleteUpdaterObservable(this.control, (value: string) => {
      return this.apollo.query<SexesQueryResult, QuerySexesArgs>({
        query: INPUT_SEXES_QUERY,
        variables: {
          params: {
            q: value
          }
        }
      }).pipe(
        map(({ data }) => data?.sexes)
      )
    });
  }

  public displaySexeFormat = (sexe: Sexe): string => {
    return sexe?.libelle ?? null;
  };
}
