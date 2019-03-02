import { Component, Input } from "@angular/core";

import { Observateur } from "../../../model/observateur.object";

@Component({
  selector: "input-observateur",
  templateUrl: "./input-observateur.tpl.html"
})
export class InputObservateurComponent {
  @Input() public observateurs: Observateur[];
  @Input() public selectedObservateur: Observateur;

  @Input() public isDisabled: boolean;
}
