import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "table-topbar",
  styleUrls: ["./table-topbar.component.scss"],
  templateUrl: "./table-topbar.component.html"
})
export class TableTopbarComponent {
  @Input() public selectedId: number;

  @Output() public onClickEditObject = new EventEmitter();

  @Output() public onClickDeleteObject = new EventEmitter();

  @Output() public onFilterChange = new EventEmitter<string>();

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
