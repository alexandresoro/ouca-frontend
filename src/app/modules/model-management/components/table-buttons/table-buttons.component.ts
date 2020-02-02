import { Component, EventEmitter, Input, Output } from "@angular/core";
import { EntiteSimple } from "basenaturaliste-model/entite-simple.object";

@Component({
  selector: "table-buttons",
  styleUrls: ["./table-buttons.component.scss"],
  templateUrl: "./table-buttons.component.html"
})
export class TableButtonsComponent {
  @Input() public object: EntiteSimple;

  @Input() public hideViewButton: boolean = false;

  @Input() public hideDeleteButton: boolean = false;

  @Output() public onClickViewObject = new EventEmitter<EntiteSimple>();

  @Output() public onClickEditObject = new EventEmitter<EntiteSimple>();

  @Output() public onClickDeleteObject = new EventEmitter<EntiteSimple>();

  public viewObject(): void {
    this.onClickViewObject.emit();
  }

  public editObject(): void {
    this.onClickEditObject.emit();
  }

  public deleteObject(): void {
    this.onClickDeleteObject.emit();
  }
}
