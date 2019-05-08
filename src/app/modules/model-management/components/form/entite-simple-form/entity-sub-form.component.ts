import { Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { CrossFieldErrorMatcher } from "../../../../shared/matchers/cross-field-error.matcher";

@Component({
  template: ""
})
export class EntitySubFormComponent {
  @Input() entityForm: FormGroup;

  matcher = new CrossFieldErrorMatcher();
}
