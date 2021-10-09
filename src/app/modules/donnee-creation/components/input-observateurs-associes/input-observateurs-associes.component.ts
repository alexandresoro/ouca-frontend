import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Observateur } from "src/app/model/graphql";

const OBSERVATEURS_ASSOCIES_QUERY = gql`
  query ObservateursAssocies {
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
    private apollo: Apollo
  ) { }

  ngOnInit(): void {
    this.observateurs$ = this.apollo.watchQuery<{ observateurs: Observateur[] }>({
      query: OBSERVATEURS_ASSOCIES_QUERY,
    }).valueChanges.pipe(
      map(({ data }) => data?.observateurs)
    )
  }

  public observateurComparator = (a1: Observateur, a2: Observateur): boolean => {
    return a1 && a2 && a1.id === a2.id;
  }

}
