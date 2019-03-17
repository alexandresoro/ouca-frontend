import { EntiteSimple } from "basenaturaliste-model/entite-simple.object";

export class AutocompleteEventObject {
  public value: EntiteSimple;

  constructor(value: EntiteSimple) {
    this.value = value;
  }
}
