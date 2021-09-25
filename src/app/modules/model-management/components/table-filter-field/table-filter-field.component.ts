import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Output, ViewChild } from "@angular/core";

@Component({
  selector: "table-filter-field",
  templateUrl: "./table-filter-field.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableFilterFieldComponent {

  @Output() public onFilterChange = new EventEmitter<string>();

  @ViewChild('filterInput') input: ElementRef<HTMLInputElement>;

  public applyFilter(value: string): void {
    this.onFilterChange.emit(value);
  }
}
