import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { FormControl } from "@angular/forms";
import { Observateur } from "basenaturaliste-model/observateur.object";
import { AutocompleteAttribute } from "../../../shared/components/autocomplete/autocomplete-attribute.object";

@Component({
  selector: "input-observateur",
  templateUrl: "./input-observateur.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputObservateurComponent {
  @Input() public control: FormControl;

  @Input() public observateurs: Observateur[];

  @Input() public placeholder?: string = "Observateur";

  public autocompleteAttributes: AutocompleteAttribute[] = [
    {
      key: "libelle",
      exactSearchMode: false,
      startWithMode: false
    }
  ];

  public displayObservateurFormat = (observateur: Observateur): string => {
    return !!observateur ? observateur.libelle : null;
  }
}
