import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "input-regroupement",
  templateUrl: "./input-regroupement.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputRegroupementComponent {
  @Input() public control: FormControl;

  @Input() public nextRegroupement: number;

  public displayNextRegroupement(): void {
    this.control.setValue(this.nextRegroupement);
  }
}
