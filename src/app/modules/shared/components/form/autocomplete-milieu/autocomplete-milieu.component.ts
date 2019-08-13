import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Milieu } from "basenaturaliste-model/milieu.object";
import { AutocompleteAttribute } from "../../autocomplete/autocomplete-attribute.object";

@Component({
  selector: "autocomplete-milieu",
  templateUrl: "./autocomplete-milieu.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteMilieuComponent {
  @Input() public milieux: Milieu[];

  @Input() public control: FormControl;

  public autocompleteAttributes: AutocompleteAttribute[] = [
    {
      key: "code",
      exactSearchMode: true,
      startWithMode: true,
      weight: 1
    },
    {
      key: "libelle",
      exactSearchMode: false,
      startWithMode: false
    }
  ];

  public displayMilieuFormat = (milieu: Milieu): string => {
    return !!milieu ? milieu.code + " - " + milieu.libelle : null;
  }
}
