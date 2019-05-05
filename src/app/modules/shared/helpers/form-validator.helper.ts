import { AbstractControl, ValidatorFn } from "@angular/forms";
import { TimeHelper } from "./time.helper";

export class FormValidatorHelper {
  public static isAnExistingEntityValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const valueIsNotAnExistingEntity: boolean =
        !control.value || (!!control.value && !control.value.id);
      return valueIsNotAnExistingEntity
        ? { forbiddenValue: { value: control.value } }
        : null;
    };
  }

  public static areExistingEntitiesValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let oneOfTheValueIsNotAnExistingEntity: boolean = false;
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

  public static isAnIntegerValidator(
    shouldBePositive?: boolean,
    restrictiveCondition?: boolean
  ): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const valueIsNotAnInteger: boolean = !Number.isInteger(control.value);

      let valueHasWrongSign: boolean = false;
      if (!valueIsNotAnInteger && !!shouldBePositive) {
        if (!restrictiveCondition) {
          valueHasWrongSign = !(control.value >= 0);
        } else {
          valueHasWrongSign = !(control.value > 0);
        }
      }

      return valueIsNotAnInteger || valueHasWrongSign
        ? { forbiddenValue: { value: control.value } }
        : null;
    };
  }

  public static timeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = TimeHelper.getFormattedTime(control.value);

      const finalDateRegExp: RegExp = new RegExp("^[0-9][0-9][:][0-9][0-9]$");
      const isNotMatchingRegExp: boolean =
        !!value && !finalDateRegExp.test(value);

      return isNotMatchingRegExp
        ? { forbiddenValue: { value: control.value } }
        : null;
    };
  }

  public static emptyValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return null;
    };
  }
}
