import { AbstractControl, ValidatorFn } from "@angular/forms";
import * as _ from "lodash";
import { TimeHelper } from "./time.helper";

export class FormValidatorHelper {
  public static isAnExistingEntityValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const valueIsNotAnExistingEntity: boolean =
        !!control.value && !control.value.id;
      return valueIsNotAnExistingEntity
        ? { forbiddenValue: { value: control.value } }
        : null;
    };
  }

  public static areExistingEntitiesValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let oneOfTheValueIsNotAnExistingEntity = false;
      for (const value of control.value) {
        if (!!value && !value.id) {
          oneOfTheValueIsNotAnExistingEntity = true;
        }
      }
      return oneOfTheValueIsNotAnExistingEntity
        ? { forbiddenValue: { value: control.value } }
        : null;
    };
  }

  public static isAnIntegerValidator(min?: number, max?: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return null;
      }

      const valueIsNotAnInteger = !Number.isInteger(control.value);

      let valueIsBelowMinimum = false;
      let valueIsAboveMaximum = false;
      if (!valueIsNotAnInteger) {
        if (Number.isInteger(min)) {
          valueIsBelowMinimum = !(control.value >= min);
        }

        if (Number.isInteger(max)) {
          valueIsAboveMaximum = !(control.value <= max);
        }
      }

      return valueIsNotAnInteger || valueIsBelowMinimum || valueIsAboveMaximum
        ? { forbiddenValue: { value: control.value } }
        : null;
    };
  }

  public static timeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = TimeHelper.getFormattedTime(control.value);

      const finalDateRegExp = new RegExp("^[0-9][0-9][:][0-9][0-9]$");
      const isNotMatchingRegExp: boolean =
        !!value && !finalDateRegExp.test(value);

      return isNotMatchingRegExp
        ? { forbiddenValue: { value: control.value } }
        : null;
    };
  }

  public static emptyValidator(): ValidatorFn {
    return (): { [key: string]: any } | null => {
      return null;
    };
  }

  public static isExisting(
    fieldName: string,
    objects: any[],
    value: string,
    id: number
  ): boolean {
    return (
      !!value &&
      !!_.find(objects, (object: any) => {
        return (
          _.deburr(object[fieldName].trim().toLowerCase()) ===
            _.deburr(value.trim().toLowerCase()) && id !== object.id
        );
      })
    );
  }

  public static getValidatorResult(
    key: string,
    value: string
  ): { [key: string]: any } | null {
    const result: { [key: string]: any } = {};
    result[key] = {
      message: value
    };
    return result;
  }
}
