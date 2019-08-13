import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Meteo } from "basenaturaliste-model/meteo.object";
import { AutocompleteAttribute } from "../../autocomplete/autocomplete-attribute.object";

@Component({
  selector: "autocomplete-meteo",
  templateUrl: "./autocomplete-meteo.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteMeteoComponent {
  @Input() public meteos: Meteo[];

  @Input() public control: FormControl;

  public autocompleteAttributes: AutocompleteAttribute[] = [
    {
      key: "libelle",
      exactSearchMode: false,
      startWithMode: false
    }
  ];

  public displayMeteoFormat = (meteo: Meteo): string => {
    return !!meteo ? meteo.libelle : null;
  }
}
