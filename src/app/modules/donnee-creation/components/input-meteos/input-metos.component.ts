import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Meteo } from "src/app/model/graphql";

type InputMeteosQueryResult = {
  meteos: Meteo[],
}

const INPUT_METEOS_QUERY = gql`
  query {
    meteos {
      id
      libelle
    }
  }
`;

@Component({
  selector: "input-meteos",
  templateUrl: "./input-meteos.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputMeteosComponent {
  @Input() public control: FormControl;

  public meteos$: Observable<Meteo[]>;

  constructor(
    private apollo: Apollo,
  ) {
    this.meteos$ = this.apollo.watchQuery<InputMeteosQueryResult>({
      query: INPUT_METEOS_QUERY
    }).valueChanges.pipe(
      map(({ data }) => {
        return data?.meteos;
      })
    );
  }
}
