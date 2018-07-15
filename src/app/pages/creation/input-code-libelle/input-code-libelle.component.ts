import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import * as diacritics from "diacritics";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { EntiteAvecLibelleEtCode } from "../../../model/entite-avec-libelle-et-code.object";
import { InputCodeLibelleEventObject } from "./input-code-libelle-event.object";

@Component({
  selector: "input-code-libelle",
  templateUrl: "./input-code-libelle.tpl.html"
})
export class InputCodeLibelleComponent {
  @Input() public num: number;

  @Input() public type: string;

  @Input() public isDisabled: boolean;

  @Input() public values: EntiteAvecLibelleEtCode[];

  @Input() public selectedValue: EntiteAvecLibelleEtCode;

  @Output()
  public onValueChanged: EventEmitter<
    InputCodeLibelleEventObject
  > = new EventEmitter<InputCodeLibelleEventObject>();

  myControl = new FormControl();

  filteredValues: Observable<EntiteAvecLibelleEtCode[]>;

  private CHARACTERS_TO_IGNORE = /(\s|\'|\-|\,)/g;

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.values && !!changes.values.currentValue) {
      this.filteredValues = this.myControl.valueChanges.pipe(
        startWith<string | EntiteAvecLibelleEtCode>(""),
        map((value) => {
          return typeof value === "string" || typeof value === "undefined"
            ? value
            : value.libelle;
        }),
        map((value) => (value ? this._filter(value) : this.values.slice()))
      );
    }
    if (!!changes.isDisabled) {
      changes.isDisabled.currentValue
        ? this.myControl.disable()
        : this.myControl.enable();
    }
  }

  displayFn(value?: EntiteAvecLibelleEtCode): string | undefined {
    return value ? value.code + " - " + value.libelle : undefined;
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
    const newSelectedValue: EntiteAvecLibelleEtCode = newValue.option.value;

    console.warn("coucou", newSelectedValue);

    this.selectedValue = newSelectedValue;

    const event: InputCodeLibelleEventObject = new InputCodeLibelleEventObject(
      newSelectedValue,
      this.num
    );
    this.onValueChanged.emit(event);
  }
}
