import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from "@angular/core";
import { FormControl } from "@angular/forms";
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger
} from "@angular/material/autocomplete";
import { MatOption } from "@angular/material/typings";
import { EntiteSimple } from "basenaturaliste-model/entite-simple.object";
import * as diacritics from "diacritics";
import { Observable, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { AutocompleteEventObject } from "./autocomplete-event.object";

import * as _ from "lodash";
import { AutocompleteAttribute } from "./autocomplete-attribute.object";

@Component({
  selector: "autocomplete",
  templateUrl: "./autocomplete.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteComponent implements OnInit {
  @Input() public type: string;

  @Input() public values: EntiteSimple[];

  @Input() public attributesToFilter: AutocompleteAttribute[];

  @Input() public startWithMode: boolean = false;

  @Input() public exactSearchMode: boolean = false;

  @Input() public control: FormControl;

  @Input() public displayFn: ((value: any) => string) | null;

  @Output() public onValueChanged: EventEmitter<
    AutocompleteEventObject
  > = new EventEmitter<AutocompleteEventObject>();

  @ViewChild(MatAutocompleteTrigger, { static: false })
  trigger: MatAutocompleteTrigger;

  filteredValues: Observable<EntiteSimple[]>;

  private CHARACTERS_TO_IGNORE = /(\s|\'|\-|\,)/g;

  ngOnInit(): void {
    this.filteredValues = this.control.valueChanges.pipe(
      map((value) => {
        return typeof value === "string" ||
          typeof value === "undefined" ||
          value === null
          ? value
          : "" + value[this.attributesToFilter[0].key];
      }),
      map((value) => (value ? this._filter(value) : []))
    );
  }

  private _filter(value: string): EntiteSimple[] {
    const filterValue: string = diacritics
      .remove(value.toLowerCase())
      .replace(this.CHARACTERS_TO_IGNORE, "");

    if (!!this.values) {
      // We sort the values by their proority (i.e. the opposite of the weight)
      const valuesWithPriorities = this.values.map((valueFromList) => {
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
      const filteredValuesWithPriorities = _.filter(
        valuesWithPriorities,
        (valuesWithPriority) => {
          return valuesWithPriority.priority <= 0;
        }
      );

      // Return the elements by priority
      return _.map(
        _.sortBy(filteredValuesWithPriorities, (filteredValuesWithPriority) => {
          return filteredValuesWithPriority.priority;
        }),
        (sortedValueWithPriority) => {
          return sortedValueWithPriority.valueFromList;
        }
      );
    }
  }

  private computePriorityInList(
    valueFromList: EntiteSimple,
    filterValue: string
  ): number {
    let priority: number = 1;

    _.forEach(
      this.attributesToFilter,
      (attributeToFilter: AutocompleteAttribute) => {
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
    if (!!attributeToFilter.exactSearchMode) {
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

    if (!!attributeToFilter.startWithMode) {
      isMatching = indexFound === 0;
    } else {
      isMatching = indexFound > -1;
    }

    if (isMatching) {
      return !!attributeToFilter.weight ? attributeToFilter.weight : 0;
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

    return diacritics
      .remove(valueFromListStr)
      .toLowerCase()
      .replace(this.CHARACTERS_TO_IGNORE, "")
      .indexOf(filterValue);
  }

  public updateValue(newValue: MatAutocompleteSelectedEvent): void {
    this.updateSelectionWithOption(newValue.option);
  }

  private updateSelectionWithOption(option: MatOption): void {
    const newSelectedValue: EntiteSimple = option ? option.value : null;

    const event: AutocompleteEventObject = new AutocompleteEventObject(
      newSelectedValue
    );
    this.onValueChanged.emit(event);
  }

  public getDisplayedValue(object: EntiteSimple): string {
    let displayedValue: string = "";

    if (!!object) {
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
