import { Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { EntiteSimple } from "ouca-common/entite-simple.object";

@Component({
  template: ""
})
export class EntitySubFormComponent<T extends EntiteSimple> {
  @Input() entityForm: FormGroup;

  @Input() entity: T;
}
