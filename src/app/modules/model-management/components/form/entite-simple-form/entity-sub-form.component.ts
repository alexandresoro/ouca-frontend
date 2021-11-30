import { Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
  template: ""
})
export class EntitySubFormComponent<T> {
  @Input() entityForm: FormGroup;

  @Input() entity: T;
}
