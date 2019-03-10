import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { AutocompleteAttribute } from "../../../../components/form/lco-autocomplete/autocomplete-attribute.object";
import { Comportement } from "../../../../model/comportement.object";

@Component({
  selector: "input-comportements",
  templateUrl: "./input-comportements.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComportementsComponent {
  @Input() public comportements: Comportement[];

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

  public addComportement(event: any, index: number): void {
    // TODO make this less crappy
    const isComportementSet = !!event.value;
    const nextComportement = index + 2;
    const nextComportementControl = this.controlGroup.controls[
      "comportement" + nextComportement
    ];

    if (!!nextComportementControl) {
      if (isComportementSet) {
        nextComportementControl.enable();
      } else {
        nextComportementControl.disable();
        nextComportementControl.setValue(null);
      }
    }
  }

  private displayComportementFormat = (comportement: Comportement): string => {
    return !!comportement
      ? comportement.code + " - " + comportement.libelle
      : null;
  }
}
