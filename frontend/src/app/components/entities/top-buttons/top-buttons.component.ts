import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
    selector: "top-buttons",
    templateUrl: "./top-buttons.tpl.html",
})
export class TopButtonsComponent {

    @Input() public title: string;

    @Input() public createButtonLibelle: string = "Créer";

    @Input() public exportButtonLibelle: string = "Exporter";

    @Input() public areButtonsDisplayed: boolean;

    @Output() public onClickNewObject = new EventEmitter();

    @Output() public onClickExportObjects = new EventEmitter();

    @Output() public onClickRefresh = new EventEmitter();

    public newObject(): void {
        this.onClickNewObject.emit();
    }

    public exportObjects(): void {
        this.onClickExportObjects.emit();
    }

    public refresh(): void {
        this.onClickRefresh.emit();
    }
}
