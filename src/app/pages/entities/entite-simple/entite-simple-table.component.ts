import { Component, EventEmitter, Input, Output } from "@angular/core";
import { EntiteSimple } from "../../../model/entite-simple.object";

@Component({
    template: "",
})
export class EntiteSimpleTableComponent<T extends EntiteSimple> {

    @Input() public objects: T[];

    @Output() public delete: EventEmitter<T> = new EventEmitter<T>();

    @Output() public edit: EventEmitter<T> = new EventEmitter<T>();

    @Output() public view: EventEmitter<T> = new EventEmitter<T>();

    public deleteObject(object: T): void {
        this.delete.emit(object);
    }

    public editObject(object: T): void {
        this.edit.emit(object);
    }

    public viewObject(object: T): void {
        this.view.emit(object);
    }
}
