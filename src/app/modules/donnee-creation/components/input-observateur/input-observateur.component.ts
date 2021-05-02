import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable } from 'rxjs';
import { Observateur } from 'src/app/model/types/observateur.object';
import { AutocompleteAttribute } from "../../../shared/components/autocomplete/autocomplete-attribute.object";


@Component({
  selector: "input-observateur",
  templateUrl: "./input-observateur.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputObservateurComponent {
  @Input() public control: FormControl;

  @Input() public observateurs: Observable<Observateur[]>;

  @Input() public placeholder?: string = "Observateur";

  public autocompleteAttributes: AutocompleteAttribute[] = [
    {
      key: "libelle",
      exactSearchMode: false,
      startWithMode: false
    }
  ];

  public displayObservateurFormat = (observateur: Observateur): string => {
    return observateur?.libelle ?? null;
  };
}
