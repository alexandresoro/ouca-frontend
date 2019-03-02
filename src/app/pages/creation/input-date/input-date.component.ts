import { Component, Input } from "@angular/core";

@Component({
  selector: "input-date",
  templateUrl: "./input-date.tpl.html"
})
export class InputDateComponent {
  @Input() public selectedDate: string;

  @Input() public isDisabled: boolean;
}
