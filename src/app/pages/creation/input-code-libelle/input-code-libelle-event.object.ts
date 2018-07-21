import { EntiteAvecLibelleEtCode } from "../../../model/entite-avec-libelle-et-code.object";

export class InputCodeLibelleEventObject {
  public value: EntiteAvecLibelleEtCode;

  constructor(value: EntiteAvecLibelleEtCode) {
    this.value = value;
  }
}
