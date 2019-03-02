import { Component, Input } from "@angular/core";

@Component({
  selector: "input-temperature",
  templateUrl: "./input-temperature.tpl.html"
})
export class InputTemperatureComponent {
  @Input() public selectedTemperature: number;

  @Input() public isDisabled: boolean;
}
