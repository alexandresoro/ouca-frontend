import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "input-commentaire",
  templateUrl: "./input-commentaire.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputCommentaireComponent {
  @Input() public control: FormControl;

  public commentaireKeyPress(event: KeyboardEvent): void {
    const inputChar = String.fromCharCode(event.charCode);
    if (inputChar.includes(";")) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
}
