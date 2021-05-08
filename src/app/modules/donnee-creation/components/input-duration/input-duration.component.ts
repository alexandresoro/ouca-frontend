import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "input-duration",
  templateUrl: "./input-duration.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputDurationComponent {
  @Input() public control: FormControl;

  @Input() public label: string;

  @Input() public id: string;
}
