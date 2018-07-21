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
import { map, startWith } from "rxjs/operators";
import { EntiteAvecLibelleEtCode } from "../../../model/entite-avec-libelle-et-code.object";
import { InputCodeLibelleEventObject } from "./input-code-libelle-event.object";

@Component({
  selector: "input-code-libelle",
  templateUrl: "./input-code-libelle.tpl.html"
})
export class InputCodeLibelleComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() public type: string;

  @Input() public isDisabled: boolean;

  @Input() public values: EntiteAvecLibelleEtCode[];

  @Input() public selectedValue: EntiteAvecLibelleEtCode;

  @Output()
  public onValueChanged: EventEmitter<
    InputCodeLibelleEventObject
  > = new EventEmitter<InputCodeLibelleEventObject>();

  @ViewChild(MatAutocompleteTrigger) trigger: MatAutocompleteTrigger;

  subscription: Subscription;

  myControl = new FormControl();

  filteredValues: Observable<EntiteAvecLibelleEtCode[]>;

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
          : value.libelle;
      }),
      map((value) => (value ? this._filter(value) : []))
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.isDisabled) {
      changes.isDisabled.currentValue
        ? this.myControl.disable()
        : this.myControl.enable();
    }
  }

  displayFn(value?: EntiteAvecLibelleEtCode): string | undefined {
    return value ? value.code + " - " + value.libelle : undefined;
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

  private _filter(value: string): EntiteAvecLibelleEtCode[] {
    const filterValue = diacritics
      .remove(value.toLowerCase())
      .replace(this.CHARACTERS_TO_IGNORE, "");

    return this.values.filter((valueFromList) => {
      return (
        valueFromList.code.toLowerCase().indexOf(filterValue) === 0 ||
        diacritics
          .remove(valueFromList.libelle)
          .toLowerCase()
          .replace(this.CHARACTERS_TO_IGNORE, "")
          .indexOf(filterValue) > -1
      );
    });
  }

  public updateValue(newValue: MatAutocompleteSelectedEvent): void {
    this.updateSelectionWithOption(newValue.option);
  }

  private updateSelectionWithOption(option: MatOption): void {
    const newSelectedValue: EntiteAvecLibelleEtCode = option
      ? option.value
      : null;

    this.selectedValue = newSelectedValue;

    const event: InputCodeLibelleEventObject = new InputCodeLibelleEventObject(
      newSelectedValue
    );
    this.onValueChanged.emit(event);
  }
}
