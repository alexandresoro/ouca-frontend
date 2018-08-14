import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
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
import { EntiteSimple } from "../../../model/entite-simple.object";
import { LcoAutocompleteEventObject } from "./lco-autocomplete-event.object";

@Component({
  selector: "lco-autocomplete",
  templateUrl: "./lco-autocomplete.tpl.html"
})
export class LcoAutocompleteComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input()
  public type: string;

  @Input()
  public disabled: boolean;

  @Input()
  public required: boolean;

  @Input()
  public values: EntiteSimple[];

  @Input()
  public selectedValue: EntiteSimple;

  @Input()
  public attributeToFilter: string;

  @Input()
  public startWithMode: boolean = false;

  @Input()
  public exactSearchMode: boolean = false;

  @Output()
  public onValueChanged: EventEmitter<
    LcoAutocompleteEventObject
  > = new EventEmitter<LcoAutocompleteEventObject>();

  @ViewChild(MatAutocompleteTrigger)
  trigger: MatAutocompleteTrigger;

  subscription: Subscription;

  myControl = new FormControl();

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
    this.filteredValues = this.myControl.valueChanges.pipe(
      map((value) => {
        return typeof value === "string" ||
          typeof value === "undefined" ||
          value === null
          ? value
          : value[this.attributeToFilter];
      }),
      map((value) => (value ? this._filter(value) : []))
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.disabled) {
      changes.disabled.currentValue
        ? this.myControl.disable()
        : this.myControl.enable();
    }
  }

  public displayFn(value?: any): string | undefined {
    return value ? value.libelle : undefined;
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
    const filterValue = diacritics
      .remove(value.toLowerCase())
      .replace(this.CHARACTERS_TO_IGNORE, "");

    return this.values.filter((valueFromList) => {
      if (this.startWithMode) {
        if (this.exactSearchMode) {
          return (
            valueFromList[this.attributeToFilter]
              .toLowerCase()
              .indexOf(filterValue) === 0
          );
        } else {
          return (
            diacritics
              .remove(valueFromList[this.attributeToFilter])
              .toLowerCase()
              .replace(this.CHARACTERS_TO_IGNORE, "")
              .indexOf(filterValue) === 0
          );
        }
      } else {
        if (this.exactSearchMode) {
          return (
            valueFromList[this.attributeToFilter]
              .toLowerCase()
              .indexOf(filterValue) > -1
          );
        } else {
          return (
            diacritics
              .remove(valueFromList[this.attributeToFilter])
              .toLowerCase()
              .replace(this.CHARACTERS_TO_IGNORE, "")
              .indexOf(filterValue) > -1
          );
        }
      }
    });
  }

  public updateValue(newValue: MatAutocompleteSelectedEvent): void {
    this.updateSelectionWithOption(newValue.option);
  }

  private updateSelectionWithOption(option: MatOption): void {
    const newSelectedValue: EntiteSimple = option ? option.value : null;

    this.selectedValue = newSelectedValue;

    const event: LcoAutocompleteEventObject = new LcoAutocompleteEventObject(
      newSelectedValue
    );
    this.onValueChanged.emit(event);
  }

  public getDisplayedValue(object: EntiteSimple): string {
    if (!!object) {
      return object[this.attributeToFilter];
    } else {
      return "";
    }
  }
}
