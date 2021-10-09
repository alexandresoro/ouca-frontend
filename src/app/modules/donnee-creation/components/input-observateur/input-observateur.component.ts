import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Apollo, gql } from "apollo-angular";
import { merge, Observable } from 'rxjs';
import { debounceTime, filter, map, switchMap } from "rxjs/operators";
import { FindParams, Observateur } from "src/app/model/graphql";

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
    this.matchingObservateurs$ = merge(
      this.control.valueChanges.pipe(
        filter((value: string | Observateur) => typeof value === "string"),
        debounceTime(150),
        switchMap((value: string) => {
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
        })
      ),
      this.control.valueChanges.pipe(
        filter((value: string | Observateur) => typeof value !== "string" && !!value?.id),
        map((value: Observateur) => [value])
      )
    );
  }

  public displayObservateurFormat = (observateur: Observateur): string => {
    return observateur?.libelle ?? null;
  };
}
