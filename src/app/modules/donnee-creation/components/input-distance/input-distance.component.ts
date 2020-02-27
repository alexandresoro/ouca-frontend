import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { EstimationDistance } from "ouca-common/estimation-distance.object";
import { AutocompleteAttribute } from "../../../shared/components/autocomplete/autocomplete-attribute.object";

@Component({
  selector: "input-distance",
  templateUrl: "./input-distance.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputDistanceComponent {
  @Input() public estimationsDistance: EstimationDistance[];

  @Input() public controlGroup: FormGroup;

  @Input() public isMultipleSelectMode?: boolean;

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
