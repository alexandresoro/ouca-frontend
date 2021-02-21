import { Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { EntiteSimple } from "@ou-ca/ouca-model";

@Component({
  template: ""
})
export class EntitySubFormComponent<T extends EntiteSimple> {
  @Input() entityForm: FormGroup;

  @Input() entity: T;
}
