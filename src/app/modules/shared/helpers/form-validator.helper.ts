import { AbstractControl, ValidatorFn } from "@angular/forms";
import { TimeHelper } from "./time.helper";

export class FormValidatorHelper {
  public static isAnExistingEntityValidator(): ValidatorFn {
    return (
      control: AbstractControl
    ): {
      forbiddenValue: {
        value: unknown;
      };
    } | null => {
      const valueIsNotAnExistingEntity: boolean =
        !!control.value && !control.value.id;
      return valueIsNotAnExistingEntity
        ? { forbiddenValue: { value: control.value } }
        : null;
    };
  }

  public static areExistingEntitiesValidator(): ValidatorFn {
    return (
      control: AbstractControl
    ): {
      forbiddenValue: {
        value: unknown;
      };
    } | null => {
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
    return (
      control: AbstractControl
    ): {
      forbiddenValue: {
        value: unknown;
      };
    } | null => {
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
    return (
      control: AbstractControl
    ): {
      forbiddenValue: {
        value: unknown;
      };
    } | null => {
      const value = TimeHelper.getFormattedTime(control.value);

      const finalDateRegExp = new RegExp("^[0-9][0-9][:][0-9][0-9]$");
      const isNotMatchingRegExp: boolean =
        !!value && !finalDateRegExp.test(value);

      return isNotMatchingRegExp
        ? { forbiddenValue: { value: control.value } }
        : null;
    };
  }

  public static getValidatorResult(
    key: string,
    value: string
  ): { [key: string]: { message: string } } | null {
    const result = {};
    result[key] = {
      message: value
    };
    return result;
  }
}
