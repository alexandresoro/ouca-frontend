import { FormGroup } from "@angular/forms";

export class DonneeHelper {
  public static updateFormState = (
    form: FormGroup,
    toEnable: boolean
  ): void => {
    if (toEnable) {
      form.enable();

      const nombreFormGroup: FormGroup = form.controls.nombreGroup as FormGroup;
      if (
        nombreFormGroup.controls.estimationNombre.value &&
        nombreFormGroup.controls.estimationNombre.value.nonCompte
      ) {
        nombreFormGroup.controls.nombre.disable();
      }
    } else {
      form.disable();
    }
  };
}
