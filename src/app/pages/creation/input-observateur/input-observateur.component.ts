import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { FormControl } from "@angular/forms";
import { Observateur } from "../../../model/observateur.object";

@Component({
  selector: "input-observateur",
  templateUrl: "./input-observateur.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputObservateurComponent {
  @Input() public control: FormControl;

  @Input() public observateurs: Observateur[];

  private displayObservateurFormat = (observateur: Observateur): string => {
    return !!observateur ? observateur.libelle : null;
  }
}
