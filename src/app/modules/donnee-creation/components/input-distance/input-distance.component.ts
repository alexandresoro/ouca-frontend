import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { EstimationDistance } from "../../../../model/estimation-distance.object";
import { AutocompleteAttribute } from "../../../shared/components/lco-autocomplete/autocomplete-attribute.object";

@Component({
  selector: "input-distance",
  templateUrl: "./input-distance.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputDistanceComponent {
  @Input() public estimationsDistance: EstimationDistance[];

  @Input() public controlGroup: FormGroup;

  public autocompleteAttributes: AutocompleteAttribute[] = [
    {
      key: "libelle",
      exactSearchMode: false,
      startWithMode: false
    }
  ];
  private displayEstimationDistanceFormat = (
    estimation: EstimationDistance
  ): string => {
    return !!estimation ? estimation.libelle : null;
  }
}
