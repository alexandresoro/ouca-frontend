import { Component, EventEmitter, Input, Output } from "@angular/core";
import { EntiteSimple } from "../../../../model/entite-simple.object";
import { EntityDetailsData } from "./entity-details-data.object";

@Component({
  selector: "entity-details",
  templateUrl: "./entity-details.tpl.html"
})
export class EntityDetailsComponent<T extends EntiteSimple> {
  @Input() detailsData: EntityDetailsData[];

  @Input() objectToView: T;
  @Input() public isBackButtonDisplayed: boolean = true;

  @Input() public detailsTitle: string = "Détails";

  @Output() public back: EventEmitter<T> = new EventEmitter<T>();

  public backToViewAll(): void {
    this.back.emit();
  }
}
