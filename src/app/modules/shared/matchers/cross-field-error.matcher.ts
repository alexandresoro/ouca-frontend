import { FormControl, FormGroupDirective, NgForm } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";

const isInvalidControl = (control: FormControl): boolean => {
  return !!(control?.dirty && control?.invalid);
};

const isFormGroupInvalidBecauseOfProvidedError = (
  form: FormGroupDirective | NgForm,
  error: string
): boolean => {
  return !!(form?.dirty && form?.invalid && form?.getError(error));
};

export class CrossFieldErrorMatcher implements ErrorStateMatcher {
  constructor(private errorType: string) {}

  isErrorState(
    control: FormControl,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return (
      isInvalidControl(control) ||
      isFormGroupInvalidBecauseOfProvidedError(form, this.errorType)
    );
  }
}
