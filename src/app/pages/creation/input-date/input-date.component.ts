import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "input-date",
  templateUrl: "./input-date.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputDateComponent {
  @Input() public control: FormControl;
}
