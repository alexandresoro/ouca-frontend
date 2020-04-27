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
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Directive({
  selector: "[autocomplete-active-selection]"
})
export class AutocompleteActiveSelection implements AfterViewInit, OnDestroy {
  private readonly destroy$ = new Subject();

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
      .pipe(takeUntil(this.destroy$))
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

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
