import { Component, EventEmitter, Input, Output } from "@angular/core";
import { EntiteSimple } from "../../../model/entite-simple.object";

@Component({
  selector: "lco-entite-select",
  templateUrl: "./lco-entite-select.tpl.html"
})
export class LcoEntiteSelectComponent {
  @Input() public id: string;

  @Input() public placeholder: string;

  @Input() public fieldForDisplay: any;

  @Input() public options: EntiteSimple[];

  @Output() public modelChange = new EventEmitter<EntiteSimple>();
  private modelValue: EntiteSimple;

  @Input()
  get model() {
    return this.modelValue;
  }

  set model(model) {
    this.modelValue = model;
    this.modelChange.emit(this.modelValue);
  }

  public getDisplayedValue(value: any): string {
    return value[this.fieldForDisplay];
  }

  public compareEntities(e1: EntiteSimple, e2: EntiteSimple): boolean {
    return e1 && e2 ? e1.id === e2.id : e1 === e2;
  }
}
