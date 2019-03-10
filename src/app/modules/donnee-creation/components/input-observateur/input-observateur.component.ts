import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { FormControl } from "@angular/forms";
import { AutocompleteAttribute } from "../../../../components/form/lco-autocomplete/autocomplete-attribute.object";
import { Observateur } from "../../../../model/observateur.object";

@Component({
  selector: "input-observateur",
  templateUrl: "./input-observateur.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputObservateurComponent {
  @Input() public control: FormControl;

  @Input() public observateurs: Observateur[];

  public autocompleteAttributes: AutocompleteAttribute[] = [
    {
      key: "libelle",
      exactSearchMode: false,
      startWithMode: false
    }
  ];

  private displayObservateurFormat = (observateur: Observateur): string => {
    return !!observateur ? observateur.libelle : null;
  }
}
