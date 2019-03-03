import { Component, Input } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "input-date",
  templateUrl: "./input-date.tpl.html"
})
export class InputDateComponent {
  @Input() public selectedDate: string;

  @Input() public control: FormControl;
}
