import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from "@angular/core";

@Component({
  selector: "top-buttons",
  styleUrls: ["./top-buttons.component.scss"],
  templateUrl: "./top-buttons.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopButtonsComponent {
  @Input() public title: string;

  @Output() public onClickNewObject = new EventEmitter();

  @Output() public onClickExportObjects = new EventEmitter();

  public newObject(): void {
    this.onClickNewObject.emit();
  }

  public exportObjects(): void {
    this.onClickExportObjects.emit();
  }
}
