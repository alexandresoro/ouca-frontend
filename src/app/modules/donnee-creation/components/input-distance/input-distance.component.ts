import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { EstimationDistance, QueryEstimationsDistanceArgs } from "src/app/model/graphql";
import autocompleteUpdaterObservable from "src/app/modules/shared/helpers/autocomplete-updater-observable";

type DistanceQueryResult = {
  estimationsDistance: EstimationDistance[],
}

const INPUT_DISTANCE_QUERY = gql`
  query EstimationsDistance($params: FindParams) {
    estimationsDistance(params: $params) {
      id
      libelle
    }
  }
`;

@Component({
  selector: "input-distance",
  templateUrl: "./input-distance.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputDistanceComponent implements OnInit {
  @Input() public controlGroup: FormGroup;

  public matchingEstimationsDistance$: Observable<EstimationDistance[]>;

  constructor(
    private apollo: Apollo
  ) {
  }

  ngOnInit(): void {
    this.matchingEstimationsDistance$ = autocompleteUpdaterObservable(this.controlGroup.controls['estimationDistance'], (value: string) => {
      return this.apollo.query<DistanceQueryResult, QueryEstimationsDistanceArgs>({
        query: INPUT_DISTANCE_QUERY,
        variables: {
          params: {
            q: value
          }
        }
      }).pipe(
        map(({ data }) => data?.estimationsDistance)
      )
    });
  }

  public displayEstimationDistanceFormat = (
    estimation: EstimationDistance
  ): string => {
    return estimation?.libelle ?? null;
  };
}
