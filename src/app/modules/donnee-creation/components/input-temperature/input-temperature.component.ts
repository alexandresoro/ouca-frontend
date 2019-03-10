import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "input-temperature",
  templateUrl: "./input-temperature.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputTemperatureComponent {
  @Input() public control: FormControl;
}
