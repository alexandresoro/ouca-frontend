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
        this.ngControl.reset(
          this.autoCompleteTrigger.activeOption
            ? this.autoCompleteTrigger.activeOption.value
            : null
        );
      });
  }

  // tslint:disable-next-line: no-empty
  ngOnDestroy(): void {}
}
