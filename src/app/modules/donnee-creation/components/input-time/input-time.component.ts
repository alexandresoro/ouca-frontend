import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "input-time",
  templateUrl: "./input-time.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputTimeComponent {
  @Input() public control: FormControl;

  @Input() public label: string;

  @Input() public id: string;
}
