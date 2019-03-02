import { Component, Input } from "@angular/core";

import { Observateur } from "../../../model/observateur.object";

@Component({
  selector: "input-observateurs-associes",
  templateUrl: "./input-observateurs-associes.tpl.html"
})
export class InputObservateursAssociesComponent {
  @Input() public observateurs: Observateur[];

  @Input() public selectedAssocies: Observateur[];

  @Input() public isDisabled: boolean;

  @Input() public isDisplayed: boolean;
}
