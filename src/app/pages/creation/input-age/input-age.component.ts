import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Age } from "../../../model/age.object";

@Component({
  selector: "input-age",
  templateUrl: "./input-age.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputAgeComponent {
  @Input() public control: FormControl;

  @Input() public ages: Age[];

  private displayAgeFormat = (age: Age): string => {
    return !!age ? age.libelle : null;
  }
}
