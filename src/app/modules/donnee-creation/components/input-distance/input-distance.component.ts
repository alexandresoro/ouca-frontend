import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { EstimationDistance } from 'src/app/model/types/estimation-distance.object';
import { AutocompleteAttribute } from "../../../shared/components/autocomplete/autocomplete-attribute.object";

type InputDistanceQueryResult = {
  estimationsDistance: EstimationDistance[],
}

const INPUT_DISTANCE_QUERY = gql`
  query {
    estimationsDistance {
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
export class InputDistanceComponent {
  @Input() public controlGroup: FormGroup;

  @Input() public isMultipleSelectMode?: boolean;

  public estimationsDistance$: Observable<EstimationDistance[]>;

  constructor(private apollo: Apollo) {
    this.estimationsDistance$ = this.apollo.watchQuery<InputDistanceQueryResult>({
      query: INPUT_DISTANCE_QUERY
    }).valueChanges.pipe(
      map(({ data }) => {
        return data?.estimationsDistance;
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

  public displayEstimationDistanceFormat = (
    estimation: EstimationDistance
  ): string => {
    return estimation ? estimation.libelle : null;
  };
}
