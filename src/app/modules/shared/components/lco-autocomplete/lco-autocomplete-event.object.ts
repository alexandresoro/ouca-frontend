import { EntiteSimple } from "../../../../model/entite-simple.object";

export class LcoAutocompleteEventObject {
  public value: EntiteSimple;

  constructor(value: EntiteSimple) {
    this.value = value;
  }
}
