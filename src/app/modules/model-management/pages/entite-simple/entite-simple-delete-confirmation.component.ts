import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "entite-delete-confirmation",
  templateUrl: "./entite-simple-delete-confirmation.tpl.html"
})
export class EntiteSimpleRemovalConfirmationComponent {
  @Input() question: string;
  @Input() details: string;
  @Input() confirmationLabel: string;
  @Input() cancellationLabel: string;

  // TODO remove
  @Input("objectToRemove") public object: any;

  @Output() public confirm: EventEmitter<boolean> = new EventEmitter();

  public confirmRemoval(): void {
    this.confirm.emit(true);
  }

  public cancelRemoval(): void {
    this.confirm.emit(false);
  }
}
