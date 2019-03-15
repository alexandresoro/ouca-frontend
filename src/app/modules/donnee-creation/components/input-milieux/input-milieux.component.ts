import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Milieu } from "../../../../model/milieu.object";
import { AutocompleteAttribute } from "../../../shared/components/autocomplete/autocomplete-attribute.object";

@Component({
  selector: "input-milieux",
  templateUrl: "./input-milieux.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputMilieuxComponent {
  @Input() public milieux: Milieu[];

  @Input() public controlGroup: FormGroup;

  public autocompleteAttributes: AutocompleteAttribute[] = [
    {
      key: "code",
      exactSearchMode: true,
      startWithMode: true
    },
    {
      key: "libelle",
      exactSearchMode: false,
      startWithMode: false
    }
  ];

  public addMilieu(event: any, index: number): void {
    // TODO make this less crappy
    const isComportementSet = !!event.value;
    const nextMilieu = index + 2;
    const nextMilieuControl = this.controlGroup.controls["milieu" + nextMilieu];

    if (!!nextMilieuControl) {
      if (isComportementSet) {
        nextMilieuControl.enable();
      } else {
        nextMilieuControl.disable();
        nextMilieuControl.setValue(null);
      }
    }
  }

  private displayMilieuFormat = (milieu: Milieu): string => {
    return !!milieu ? milieu.code + " - " + milieu.libelle : null;
  }
}
