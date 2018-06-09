import { Component, EventEmitter, Input, Output } from "@angular/core";
import { EntiteSimple } from "../../../model/entite-simple.object";
import { GestionMode, GestionModeHelper } from "../gestion-mode.enum";

@Component({
    template: "",
})
export class EntiteSimpleFormComponent<T extends EntiteSimple> {

    @Input() public creationTitle: string;

    @Input() public editionTitle: string;

    @Input() public object: T = this.getNewObject();

    @Input() public mode: GestionMode;

    @Output() public confirm: EventEmitter<T> = new EventEmitter<T>();

    @Output() public back: EventEmitter<T> = new EventEmitter();

    constructor(public modeHelper: GestionModeHelper) {
    }

    public save(): void {
        this.confirm.emit(this.object);
    }

    public cancel(): void {
        this.back.emit();
    }

    public getNewObject(): T {
        return null;
    }
}