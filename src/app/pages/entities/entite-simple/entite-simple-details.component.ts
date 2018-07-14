import { Component, EventEmitter, Input, Output } from "@angular/core";
import { EntiteDetailsData } from "../../../model/entite-details-data.objects";
import { EntiteSimple } from "../../../model/entite-simple.object";

@Component({
  selector: "entite-details",
  templateUrl: "./entite-simple-details.tpl.html"
})
export class EntiteSimpleDetailsComponent<T extends EntiteSimple> {
  @Input() detailsData: EntiteDetailsData[];

  @Input() objectToView: T;
  @Input() public isBackButtonDisplayed: boolean = true;

  @Input() public detailsTitle: string = "Détails";

  @Output() public back: EventEmitter<T> = new EventEmitter<T>();

  public backToViewAll(): void {
    this.back.emit();
  }
}
