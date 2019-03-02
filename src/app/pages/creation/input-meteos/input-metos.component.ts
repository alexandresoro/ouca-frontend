import { Component, Input } from "@angular/core";

import { Meteo } from "../../../model/meteo.object";

@Component({
  selector: "input-meteos",
  templateUrl: "./input-meteos.tpl.html"
})
export class InputMeteosComponent {
  @Input() public meteos: Meteo[];

  @Input() public selectedMeteos: Meteo[];

  @Input() public isDisabled: boolean;
}
