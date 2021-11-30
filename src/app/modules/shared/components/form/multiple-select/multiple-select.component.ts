import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "multiple-select",
  templateUrl: "./multiple-select.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultipleSelectComponent {
  @Input() public attributesToDisplay: string[];
  @Input() public control: FormControl;
  @Input() public id: string;
  @Input() public options: { id: number }[];
  @Input() public placeholder: string;

  public getDisplayedValue = (object: { [key: string]: unknown }): string => {
    let displayedValue = "";

    if (object) {
      displayedValue = object[this.attributesToDisplay[0]] as string;
      for (
        let indexAttribute = 1;
        indexAttribute < this.attributesToDisplay.length;
        indexAttribute++
      ) {
        displayedValue =
          displayedValue +
          " - " +
          object[this.attributesToDisplay[indexAttribute]];
      }
    }

    return displayedValue;
  };
}
