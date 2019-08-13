import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Comportement } from "basenaturaliste-model/comportement.object";
import { AutocompleteAttribute } from "../../autocomplete/autocomplete-attribute.object";

@Component({
  selector: "autocomplete-comportement",
  templateUrl: "./autocomplete-comportement.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteComportementComponent {
  @Input() public comportements: Comportement[];

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

  public displayComportementFormat = (comportement: Comportement): string => {
    return !!comportement
      ? comportement.code + " - " + comportement.libelle
      : null;
  }
}
