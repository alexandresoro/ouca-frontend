import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormControl } from "@angular/forms";
import { RegroupementService } from "src/app/services/regroupement.service";

@Component({
  selector: "input-regroupement",
  templateUrl: "./input-regroupement.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputRegroupementComponent {
  @Input() public control: FormControl;

  @Input() public hideButton: boolean;

  constructor(private regroupementService: RegroupementService) {}

  public displayNextRegroupement(): void {
    this.regroupementService
      .updateNextRegroupement()
      .subscribe((nextRegroupement) => {
        this.control.setValue(nextRegroupement);
      });
  }
}
