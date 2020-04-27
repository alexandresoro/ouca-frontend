import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "not-found",
  templateUrl: "./not-found.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundComponent {}
