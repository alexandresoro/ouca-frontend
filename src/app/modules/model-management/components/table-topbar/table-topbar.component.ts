import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges
} from "@angular/core";
import { EntiteSimple } from "../../../../../basenaturaliste-model/entite-simple.object";

@Component({
  selector: "table-topbar",
  templateUrl: "./table-topbar.tpl.html"
})
export class TableTopbarComponent {
  @Input() public selectedObject: EntiteSimple;

  @Input() public hideViewButton: boolean = false;

  @Input() public hideDeleteButton: boolean = false;

  @Output() public onClickViewObject = new EventEmitter();

  @Output() public onClickEditObject = new EventEmitter();

  @Output() public onClickDeleteObject = new EventEmitter();

  @Output() public onFilterChange = new EventEmitter<string>();

  public viewObject(): void {
    this.onClickViewObject.emit();
  }

  public editObject(): void {
    this.onClickEditObject.emit();
  }

  public deleteObject(): void {
    this.onClickDeleteObject.emit();
  }

  public applyFilter(value: string): void {
    this.onFilterChange.emit(value);
  }
}
