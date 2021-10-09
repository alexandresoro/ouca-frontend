import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatAutocomplete, MatAutocompleteActivatedEvent } from '@angular/material/autocomplete';
import { fromEvent, Observable, Subject } from "rxjs";
import { filter, startWith, takeUntil, withLatestFrom } from "rxjs/operators";

@Component({
  selector: "autocomplete-v2",
  templateUrl: "./autocomplete-v2.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteV2Component<T extends { id: number }> implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild("autocompleteInput") autocompleteInput: ElementRef<HTMLInputElement>;

  @ViewChild("auto") autocomplete: MatAutocomplete;

  @Input() public type: string;

  @Input() public values: Observable<T[]>;

  @Input() public control: FormControl;

  @Input() public displayFn: ((value: T) => string) | null;

  @Output() public optionActivated: EventEmitter<T> = new EventEmitter<T>();

  @Output() public focus: EventEmitter<Event> = new EventEmitter<Event>();

  @Output() public focusout: EventEmitter<Event> = new EventEmitter<Event>();

  private readonly destroy$ = new Subject();

  private optionActivated$ = new Subject<T>();

  ngOnInit(): void {

    this.optionActivated$
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((optionActivated) => {
        this.optionActivated?.emit(optionActivated);
      });

  }

  ngAfterViewInit(): void {

    fromEvent(this.autocompleteInput.nativeElement, "focus").subscribe((event) => {
      this.focus?.emit(event);
    })

    fromEvent(this.autocompleteInput.nativeElement, "focusout") // focusout is the event triggered when the input is about to lose the focus
      .pipe(
        filter(() => !this.autocomplete.isOpen), // ignore focusout events that are because its own autocomplete panel has been opened
        withLatestFrom(
          this.optionActivated$.pipe(startWith(null as T)), // this is how we are detecting that we need to set an option
          this.values
        ),
        takeUntil(this.destroy$)
      ).subscribe(([event, optionActivated, filteredValues]) => {

        this.focusout?.emit(event);

        // Here we have the list of filtered values that correspond to the currently possible selections
        // and the option selected that corresponds to the LATEST option that was active

        // The case where the "option selected" is not included in the filtered values is the case where for instance
        // we type a letter that opens the selection and will activate the first match
        // then we clear the field => filteredValues will become empty
        // In that case, the option is still "selected" but is not valid anymore

        const isActivatedOptionValid = !!filteredValues?.find((filteredValue) => filteredValue.id === optionActivated?.id);
        if (isActivatedOptionValid && optionActivated !== this.control.value) {
          this.control.setValue(optionActivated);
        } if (this.control.invalid) {
          this.control.setValue(null);
        }
      });

  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onOptionActivated = (event: MatAutocompleteActivatedEvent): void => {
    this.optionActivated$.next(event?.option?.value as T);
  }

}
