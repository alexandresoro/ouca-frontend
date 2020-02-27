import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { FormControl } from "@angular/forms";
import { Observateur } from "ouca-common/observateur.object";

@Component({
  selector: "input-observateurs-associes",
  templateUrl: "./input-observateurs-associes.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputObservateursAssociesComponent {
  @Input() public control: FormControl;

  @Input() public observateurs: Observateur[];
}
