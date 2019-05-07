import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Age } from "basenaturaliste-model/age.object";
import { AutocompleteAttribute } from "../../../shared/components/autocomplete/autocomplete-attribute.object";

@Component({
  selector: "input-age",
  templateUrl: "./input-age.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputAgeComponent {
  @Input() public control: FormControl;

  @Input() public ages: Age[];

  public autocompleteAttributes: AutocompleteAttribute[] = [
    {
      key: "libelle",
      exactSearchMode: false,
      startWithMode: false
    }
  ];

  public displayAgeFormat = (age: Age): string => {
    return !!age ? age.libelle : null;
  }
}
