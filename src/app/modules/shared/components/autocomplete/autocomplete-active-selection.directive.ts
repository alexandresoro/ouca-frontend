import {
  AfterViewInit,
  Directive,
  Host,
  Input,
  OnDestroy,
  Self
} from "@angular/core";
import { FormControl } from "@angular/forms";
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

  @Input()
  formControl: FormControl;

  constructor(
    @Host()
    @Self()
    private readonly autoCompleteTrigger: MatAutocompleteTrigger
  ) {}

  ngAfterViewInit(): void {
    this.autoCompleteTrigger.panelClosingActions
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (
          this.autoCompleteTrigger.activeOption &&
          this.autoCompleteTrigger.activeOption.value !== this.formControl.value
        ) {
          this.formControl.setValue(
            this.autoCompleteTrigger.activeOption.value
          );
        } else if (!this.formControl.valid) {
          this.formControl.setValue(null);
        }
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
