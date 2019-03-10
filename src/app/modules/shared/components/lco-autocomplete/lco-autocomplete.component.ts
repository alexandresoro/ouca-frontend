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
import * as diacritics from "diacritics";
import { Observable, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { EntiteSimple } from "../../../../model/entite-simple.object";
import { AutocompleteAttribute } from "./autocomplete-attribute.object";
import { LcoAutocompleteEventObject } from "./lco-autocomplete-event.object";

import * as _ from "lodash";

@Component({
  selector: "lco-autocomplete",
  templateUrl: "./lco-autocomplete.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LcoAutocompleteComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @Input() public type: string;

  @Input() public values: EntiteSimple[];

  @Input() public attributesToFilter: AutocompleteAttribute[];

  @Input() public startWithMode: boolean = false;

  @Input() public exactSearchMode: boolean = false;

  @Input() public control: FormControl;

  @Input() public displayFn: ((value: any) => string) | null;

  @Output() public onValueChanged: EventEmitter<
    LcoAutocompleteEventObject
  > = new EventEmitter<LcoAutocompleteEventObject>();

  @ViewChild(MatAutocompleteTrigger)
  trigger: MatAutocompleteTrigger;

  subscription: Subscription;

  filteredValues: Observable<EntiteSimple[]>;

  private CHARACTERS_TO_IGNORE = /(\s|\'|\-|\,)/g;

  ngAfterViewInit() {
    this._subscribeToClosingActions();
  }

  ngOnDestroy() {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

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

  private _subscribeToClosingActions(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.trigger.panelClosingActions.subscribe(
      (e) => {
        if (this.trigger.activeOption) {
          this.updateSelectionWithOption(this.trigger.activeOption);
        } else {
          this.updateSelectionWithOption(null);
        }
        this.trigger.closePanel();
      },
      (err) => this._subscribeToClosingActions(),
      () => this._subscribeToClosingActions()
    );
  }

  private _filter(value: string): EntiteSimple[] {
    const filterValue: string = diacritics
      .remove(value.toLowerCase())
      .replace(this.CHARACTERS_TO_IGNORE, "");

    if (!!this.values) {
      return this.values.filter((valueFromList) => {
        return this.searchInOptionsList(valueFromList, filterValue);
      });
    }
  }

  private searchInOptionsList(
    valueFromList: EntiteSimple,
    filterValue: string
  ): boolean {
    return _.some(
      this.attributesToFilter,
      (attributeToFilter: AutocompleteAttribute) => {
        return this.search(valueFromList, filterValue, attributeToFilter);
      }
    );
  }

  private search(
    valueFromList: EntiteSimple,
    filterValue: string,
    attributeToFilter: AutocompleteAttribute
  ): boolean {
    if (attributeToFilter.startWithMode) {
      return !!attributeToFilter.exactSearchMode
        ? this.exactSearch(
            valueFromList,
            filterValue,
            attributeToFilter.key
          ) === 0
        : this.approximativeSearch(
            valueFromList,
            filterValue,
            attributeToFilter.key
          ) === 0;
    } else {
      return !!attributeToFilter.exactSearchMode
        ? this.exactSearch(valueFromList, filterValue, attributeToFilter.key) >
            -1
        : this.approximativeSearch(
            valueFromList,
            filterValue,
            attributeToFilter.key
          ) > -1;
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

    const event: LcoAutocompleteEventObject = new LcoAutocompleteEventObject(
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
