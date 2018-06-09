import { Component, forwardRef, Input } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

// tslint:disable-next-line:no-empty
const noop = (_?: any) => {
};

/**
 * Component for input text
 * Example: <lco-input-text [id]="'id-input'" [(ngModel)]="modelValue"></lco-input-text>
 */
@Component({
    selector: "lco-input-text",
    templateUrl: "./lco-input-text.tpl.html",
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => LcoInputTextComponent), multi: true },
    ],
})
export class LcoInputTextComponent implements ControlValueAccessor {

    @Input() public id: string;

    @Input() public placeholder: string = "";

    // tslint:disable-next-line:variable-name
    protected _value: any = "";

    get value(): any {
        return this._value;
    }

    set value(v: any) {
        if (v !== this._value) {
            this._value = v;
            this.onChange(v);
        }
    }

    public writeValue(value: any) {
        this._value = value;
        this.onChange(value);
    }

    protected onChange: (_: any) => void = noop;

    protected onTouched: () => void = noop;

    public registerOnChange(fn: (_: any) => void): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }
}
