import { EntiteSimple } from "../../../../model/entite-simple.object";

export class AutocompleteEventObject {
  public value: EntiteSimple;

  constructor(value: EntiteSimple) {
    this.value = value;
  }
}
