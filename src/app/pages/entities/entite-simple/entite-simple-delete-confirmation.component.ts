import { Component, EventEmitter, Input, Output } from "@angular/core";
import { EntiteSimple } from "../../../model/entite-simple.object";

@Component({
    template: "",
})
export class EntiteSimpleRemovalConfirmationComponent<T extends EntiteSimple> {

    @Input("objectToRemove") public object: T;

    @Output() public confirm: EventEmitter<T> = new EventEmitter<T>();

    public confirmRemoval(): void {
        this.confirm.emit(this.object);
    }

    public cancelRemoval(): void {
        this.confirm.emit(null);
    }

}
