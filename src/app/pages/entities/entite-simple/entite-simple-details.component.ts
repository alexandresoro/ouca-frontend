import { Component, EventEmitter, Input, Output } from "@angular/core";
import { EntiteSimple } from "../../../model/entite-simple.object";

@Component({
    template: "",
})
export class EntiteSimpleDetailsComponent<T extends EntiteSimple> {

    @Input("objectToView") public object: T;

    @Input() public isBackButtonDisplayed: boolean = true;

    @Input() public detailsTitle: string = "Détails";

    @Output() public back: EventEmitter<T> = new EventEmitter<T>();

    public backToViewAll(): void {
        this.back.emit();
    }
}
