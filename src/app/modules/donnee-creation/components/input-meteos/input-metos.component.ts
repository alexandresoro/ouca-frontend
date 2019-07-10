import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { FormControl } from "@angular/forms";
import { Meteo } from "basenaturaliste-model/meteo.object";

@Component({
  selector: "input-meteos",
  templateUrl: "./input-meteos.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputMeteosComponent {
  @Input() public meteos: Meteo[];
  @Input() public control: FormControl;
}
