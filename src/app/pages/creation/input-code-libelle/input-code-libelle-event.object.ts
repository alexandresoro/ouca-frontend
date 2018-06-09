import { EntiteAvecLibelleEtCode } from "./../../../model/entite-avec-libelle-et-code.object";

export class InputCodeLibelleEventObject {

    public value: EntiteAvecLibelleEtCode;

    public index: number;

    constructor(value: EntiteAvecLibelleEtCode, index: number) {
        this.value = value;
        this.index = index;
    }
}
