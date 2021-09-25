import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Age } from "src/app/model/graphql";
import { AutocompleteAttribute } from "../../../shared/components/autocomplete/autocomplete-attribute.object";

type InputAgesQueryResult = {
  ages: Age[],
}

const INPUT_AGES_QUERY = gql`
  query {
    ages {
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
export class InputAgeComponent {
  @Input() public control: FormControl;

  public ages$: Observable<Age[]>;

  constructor(
    private apollo: Apollo,
  ) {
    this.ages$ = this.apollo.watchQuery<InputAgesQueryResult>({
      query: INPUT_AGES_QUERY
    }).valueChanges.pipe(
      map(({ data }) => {
        return data?.ages;
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

  public displayAgeFormat = (age: Age): string => {
    return age ? age.libelle : null;
  };
}
