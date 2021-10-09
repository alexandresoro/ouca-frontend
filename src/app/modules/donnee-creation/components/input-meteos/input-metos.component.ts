import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Meteo } from "src/app/model/graphql";

const METEOS_QUERY = gql`
  query Meteos {
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
    private apollo: Apollo
  ) { }

  ngOnInit(): void {
    this.meteos$ = this.apollo.watchQuery<{ meteos: Meteo[] }>({
      query: METEOS_QUERY,
    }).valueChanges.pipe(
      map(({ data }) => data?.meteos)
    )
  }

  public meteoComparator = (a1: Meteo, a2: Meteo): boolean => {
    return a1 && a2 && a1.id === a2.id;
  }

}
