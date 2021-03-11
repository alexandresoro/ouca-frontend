import { Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { EntiteSimple } from 'src/app/model/types/entite-simple.object';

@Component({
  template: ""
})
export class EntitySubFormComponent<T extends EntiteSimple> {
  @Input() entityForm: FormGroup;

  @Input() entity: T;
}
