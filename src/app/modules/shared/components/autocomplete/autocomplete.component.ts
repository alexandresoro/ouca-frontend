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
import deburr from 'lodash.deburr';
import { fromEvent, Observable, of, Subject } from "rxjs";
import { filter, map, startWith, takeUntil, withLatestFrom } from "rxjs/operators";
import { EntiteSimple } from 'src/app/model/types/entite-simple.object';
import { sortBy } from '../../helpers/utils';
import { AutocompleteAttribute } from "./autocomplete-attribute.object";

@Component({
  selector: "autocomplete",
  templateUrl: "./autocomplete.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteComponent<T extends EntiteSimple> implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild("autocompleteInput") autocompleteInput: ElementRef<HTMLInputElement>;

  @ViewChild("auto") autocomplete: MatAutocomplete;

  @Input() public type: string;

  @Input() public values?: EntiteSimple[];

  @Input() public valuesObs?: Observable<EntiteSimple[]>;

  @Input() public attributesToFilter: AutocompleteAttribute[];

  @Input() public control: FormControl;

  // The maximum number of elements to be displayed in the autocomplete
  @Input() public maxDisplayedEntries?: number;

  @Input() public displayFn: ((value: any) => string) | null;

  @Output() public optionActivated: EventEmitter<T> = new EventEmitter<T>();

  @Output() public focus: EventEmitter<Event> = new EventEmitter<Event>();

  @Output() public focusout: EventEmitter<Event> = new EventEmitter<Event>();

  private readonly destroy$ = new Subject();

  filteredValues: Observable<EntiteSimple[]>;

  private optionActivated$ = new Subject<T>();

  private CHARACTERS_TO_IGNORE = /(\s|\'|\-|\,)/g;

  ngOnInit(): void {

    this.filteredValues = this.control.valueChanges.pipe(
      withLatestFrom(this.valuesObs ?? of<EntiteSimple[]>(undefined)),
      map(([value, allValues]) => {

        const valuesToUse = allValues ?? this.values;

        if ((typeof value === "string") || value == null) {
          // If the value is a string or null, then look for entities that are matching
          return this._filter(value, valuesToUse);
        } else {
          // If not, we assume that it is an entite simple that is selected, so we only display this one as matching
          const valueIdentifier = value[this.attributesToFilter[0].key];

          const matchingEntity = valuesToUse?.find((oneValue) => {
            return oneValue[this.attributesToFilter[0].key] === valueIdentifier;
          });

          return matchingEntity ? [matchingEntity] : [];
        }
      })
    );

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
          this.optionActivated$.pipe(startWith(null as EntiteSimple)), // this is how we are detecting that we need to set an option
          this.filteredValues
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

  private _filter(value: string, allValues: EntiteSimple[]): EntiteSimple[] {

    if (!value) {
      return [];
    }

    const filterValue: string = deburr(value.toLowerCase()).replace(
      this.CHARACTERS_TO_IGNORE,
      ""
    );

    if (allValues) {
      // We sort the values by their proority (i.e. the opposite of the weight)
      const valuesWithPriorities = allValues.map(valueFromList => {
        const priority: number = this.computePriorityInList(
          valueFromList,
          filterValue
        );
        return {
          valueFromList,
          priority
        };
      });

      // Keep only the elements that match
      const filteredValuesWithPriorities = valuesWithPriorities?.filter(
        valuesWithPriority => {
          return valuesWithPriority.priority <= 0;
        }
      ) ?? [];

      // Return the elements by priority
      const sortedElements = sortBy(filteredValuesWithPriorities, (first, second) => {
        return first.priority - second.priority;
      })?.map(
        sortedValueWithPriority => {
          return sortedValueWithPriority.valueFromList;
        }
      );

      if (this.maxDisplayedEntries) {
        return sortedElements.slice(0, this.maxDisplayedEntries);
      } else {
        return sortedElements;
      }
    }
  }

  private computePriorityInList(
    valueFromList: EntiteSimple,
    filterValue: string
  ): number {
    let priority = 1;

    this.attributesToFilter?.forEach(
      (attributeToFilter) => {
        const weight: number = this.searchWithWeight(
          valueFromList,
          filterValue,
          attributeToFilter
        );
        if (weight >= 0) {
          // The value has been found
          // If not found before, we reset the priority to 0
          if (priority > 0) {
            priority = 0;
          }
          priority -= weight;
        }
      }
    );

    return priority;
  }

  // Perform a search of the filterValue and returns a weight
  // It will return -1 if value is not found, otherwise it returns a weight >=0
  private searchWithWeight(
    valueFromList: EntiteSimple,
    filterValue: string,
    attributeToFilter: AutocompleteAttribute
  ): number {
    let isMatching: boolean;

    let indexFound: number;
    if (attributeToFilter.exactSearchMode) {
      indexFound = this.exactSearch(
        valueFromList,
        filterValue,
        attributeToFilter.key
      );
    } else {
      indexFound = this.approximativeSearch(
        valueFromList,
        filterValue,
        attributeToFilter.key
      );
    }

    if (attributeToFilter.startWithMode) {
      isMatching = indexFound === 0;
    } else {
      isMatching = indexFound > -1;
    }

    if (isMatching) {
      return attributeToFilter.weight ? attributeToFilter.weight : 0;
    } else {
      return -1;
    }
  }
  private exactSearch(
    valueFromList: EntiteSimple,
    filterValue: string,
    attributeToFilter: string
  ): number {
    const valueFromListStr =
      typeof valueFromList[attributeToFilter] === "string"
        ? valueFromList[attributeToFilter]
        : "" + valueFromList[attributeToFilter];

    if (!isNaN(valueFromListStr) && !isNaN(filterValue as any)) {
      return (+valueFromListStr + "").indexOf(+filterValue + "");
    }

    return valueFromListStr.toLowerCase().indexOf(filterValue);
  }

  private approximativeSearch(
    valueFromList: EntiteSimple,
    filterValue: string,
    attributeToFilter: string
  ): number {
    const valueFromListStr =
      typeof valueFromList[attributeToFilter] === "string"
        ? valueFromList[attributeToFilter]
        : "" + valueFromList[attributeToFilter];

    return deburr(valueFromListStr)
      .toLowerCase()
      .replace(this.CHARACTERS_TO_IGNORE, "")
      .indexOf(filterValue);
  }

  public getDisplayedValue(object: EntiteSimple): string {
    let displayedValue = "";

    if (object) {
      displayedValue = object[this.attributesToFilter[0].key];
      for (
        let indexAttribute = 1;
        indexAttribute < this.attributesToFilter.length;
        indexAttribute++
      ) {
        displayedValue =
          displayedValue +
          " - " +
          object[this.attributesToFilter[indexAttribute].key];
      }
    }

    return displayedValue;
  }
}
