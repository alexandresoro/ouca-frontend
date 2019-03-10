import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "input-commentaire",
  templateUrl: "./input-commentaire.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputCommentaireComponent {
  @Input() public control: FormControl;

  public commentaireKeyPress(event: any) {
    const pattern = new RegExp(";");
    const inputChar = String.fromCharCode(event.charCode);
    if (pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
}
