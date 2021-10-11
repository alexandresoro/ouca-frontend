import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Apollo, gql } from "apollo-angular";
import { merge, Observable } from "rxjs";
import { debounceTime, filter, map, switchMap } from "rxjs/operators";
import { EstimationDistance, FindParams } from "src/app/model/graphql";

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

    this.matchingEstimationsDistance$ = merge(
      this.controlGroup.controls['estimationDistance'].valueChanges.pipe(
        filter((value: string | EstimationDistance) => typeof value === "string"),
        debounceTime(150),
        switchMap((value: string) => {
          return this.apollo.query<DistanceQueryResult, { params: FindParams }>({
            query: INPUT_DISTANCE_QUERY,
            variables: {
              params: {
                q: value
              }
            }
          }).pipe(
            map(({ data }) => data?.estimationsDistance)
          )
        })
      ),
      this.controlGroup.controls['estimationDistance'].valueChanges.pipe(
        filter((value: string | EstimationDistance) => typeof value !== "string" && !!value?.id),
        map((value: EstimationDistance) => [value])
      )
    );
  }

  public displayEstimationDistanceFormat = (
    estimation: EstimationDistance
  ): string => {
    return estimation?.libelle ?? null;
  };
}
