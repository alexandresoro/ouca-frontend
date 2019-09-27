import {
  AfterViewInit,
  Directive,
  Host,
  Input,
  OnDestroy,
  Self
} from "@angular/core";
import { NgControl } from "@angular/forms";
import {
  MatAutocomplete,
  MatAutocompleteTrigger
} from "@angular/material/autocomplete";
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

  ngAfterViewInit(): void {
    this.autoCompleteTrigger.panelClosingActions
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        if (
          this.autoCompleteTrigger.activeOption &&
          this.autoCompleteTrigger.activeOption.value !== this.ngControl.value
        ) {
          this.ngControl.reset(this.autoCompleteTrigger.activeOption.value);
        } else if (!this.ngControl.valid) {
          this.ngControl.reset(null);
        }
      });
  }

  ngOnDestroy(): void {} // eslint-disable-line @typescript-eslint/no-empty-function
}
