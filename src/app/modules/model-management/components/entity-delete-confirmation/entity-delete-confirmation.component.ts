import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "entity-delete-confirmation",
  templateUrl: "./entity-delete-confirmation.tpl.html"
})
export class EntityDeleteConfirmationComponent {
  @Input() question: string;
  @Input() details: string;
  @Input() confirmationLabel: string;
  @Input() cancellationLabel: string;

  @Output() public confirm: EventEmitter<boolean> = new EventEmitter();

  public confirmRemoval(): void {
    this.confirm.emit(true);
  }

  public cancelRemoval(): void {
    this.confirm.emit(false);
  }
}
