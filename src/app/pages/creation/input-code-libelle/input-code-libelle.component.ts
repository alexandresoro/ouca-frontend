import { Component, EventEmitter, Input, Output } from "@angular/core";
import { EntiteAvecLibelleEtCode } from "./../../../model/entite-avec-libelle-et-code.object";
import { InputCodeLibelleEventObject } from "./input-code-libelle-event.object";

@Component({
    selector: "input-code-libelle",
    templateUrl: "./input-code-libelle.tpl.html",
})
export class InputCodeLibelleComponent {

    @Input() public num: number;

    @Input() public type: string;

    @Input() public isDisabled: boolean;

    @Input() public values: EntiteAvecLibelleEtCode[];

    @Input() public selectedValue: EntiteAvecLibelleEtCode;

    @Output() public onValueChanged: EventEmitter<InputCodeLibelleEventObject> =
    new EventEmitter<InputCodeLibelleEventObject>();

    public updateValue(newValue: EntiteAvecLibelleEtCode): void {
        this.selectedValue = newValue;

        const event: InputCodeLibelleEventObject = new InputCodeLibelleEventObject(newValue, this.num);
        this.onValueChanged.emit(event);
    }

}
