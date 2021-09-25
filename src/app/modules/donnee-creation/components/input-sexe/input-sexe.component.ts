import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Sexe } from "src/app/model/graphql";
import { AutocompleteAttribute } from "../../../shared/components/autocomplete/autocomplete-attribute.object";

type InputSexesQueryResult = {
  sexes: Sexe[],
}

const INPUT_SEXES_QUERY = gql`
  query {
    sexes {
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
export class InputSexeComponent {
  @Input() public control: FormControl;

  public sexes$: Observable<Sexe[]>;

  constructor(
    private apollo: Apollo,
  ) {
    this.sexes$ = this.apollo.watchQuery<InputSexesQueryResult>({
      query: INPUT_SEXES_QUERY
    }).valueChanges.pipe(
      map(({ data }) => {
        return data?.sexes;
      })
    );
  }

  public autocompleteAttributes: AutocompleteAttribute[] = [
    {
      key: "libelle",
      exactSearchMode: false,
      startWithMode: true
    }
  ];

  public displaySexeFormat = (sexe: Sexe): string => {
    return sexe ? sexe.libelle : null;
  };
}
