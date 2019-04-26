import { Component, EventEmitter, Input, Output } from "@angular/core";
import { EntiteSimple } from "basenaturaliste-model/entite-simple.object";

@Component({
  selector: "bn-select",
  templateUrl: "./bn-select.tpl.html"
})
export class BnSelectComponent {
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
    if (!!value) {
      return value[this.fieldForDisplay];
    } else {
      return "";
    }
  }

  public compareEntities(e1: EntiteSimple, e2: EntiteSimple): boolean {
    return e1 && e2 ? e1.id === e2.id : e1 === e2;
  }
}
