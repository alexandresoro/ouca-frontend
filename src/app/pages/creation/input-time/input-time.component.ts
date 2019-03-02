import { Component, Input } from "@angular/core";

@Component({
  selector: "input-time",
  templateUrl: "./input-time.tpl.html"
})
export class InputTimeComponent {
  @Input() public selectedTime: string;

  @Input() public isDisabled: boolean;

  @Input() public label: string;

  @Input() public id: string;
}
