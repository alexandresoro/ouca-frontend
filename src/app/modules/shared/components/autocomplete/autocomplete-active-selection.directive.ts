import {
  AfterViewInit,
  Directive,
  Host,
  Input,
  OnDestroy,
  Self
} from "@angular/core";
import { NgControl } from "@angular/forms";
import { MatAutocomplete, MatAutocompleteTrigger } from "@angular/material";
import { untilDestroyed } from "ngx-take-until-destroy";

@Directive({
  selector: "[autocomplete-active-selection]"
})
export class AutocompleteActiveSelection implements AfterViewInit, OnDestroy {
  @Input()
  matAutocomplete: MatAutocomplete;

  constructor(
    @Host()
    @Self()
    private readonly autoCompleteTrigger: MatAutocompleteTrigger,
    private ngControl: NgControl
  ) {}

  ngAfterViewInit() {
    this.autoCompleteTrigger.panelClosingActions
      .pipe(untilDestroyed(this))
      .subscribe((e) => {
        if (this.autoCompleteTrigger.activeOption) {
          this.ngControl.reset(this.autoCompleteTrigger.activeOption.value);
        } else if (!this.ngControl.valid) {
          this.ngControl.reset(null);
        }
      });
  }

  // tslint:disable-next-line: no-empty
  ngOnDestroy(): void {}
}
