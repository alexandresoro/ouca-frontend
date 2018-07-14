import { Component, EventEmitter, Input, Output } from "@angular/core";
import { EntiteSimple } from "../../../model/entite-simple.object";

@Component({
  selector: "entite-delete-confirmation",
  templateUrl: "./entite-simple-delete-confirmation.tpl.html"
})
export class EntiteSimpleRemovalConfirmationComponent<T extends EntiteSimple> {
  @Input() question: string;
  @Input() details: string;
  @Input() confirmationLabel: string;
  @Input() cancellationLabel: string;
  @Input("objectToRemove") public object: T;

  @Output() public confirm: EventEmitter<T> = new EventEmitter<T>();

  public confirmRemoval(): void {
    this.confirm.emit(this.object);
  }

  public cancelRemoval(): void {
    this.confirm.emit(null);
  }
}
