import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Type,
  ViewChild
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { EntiteSimple } from "basenaturaliste-model/entite-simple.object";
import { EntityModeHelper } from "../../../helpers/entity-mode.helper";
import { EntitySubFormComponent } from "./entity-sub-form.component";
import { EntitySubFormDirective } from "./entity-sub-form.directive";

@Component({
  selector: "entity-form",
  templateUrl: "./entity-form.tpl.html"
})
export class EntityFormComponent implements OnInit {
  @Input() componentType: Type<EntitySubFormComponent>;

  @ViewChild(EntitySubFormDirective)
  entitySubFormDirective: EntitySubFormDirective;

  @Input() public creationTitle: string;

  @Input() public editionTitle: string;

  @Input() public object: any = {};

  @Input() public entityForm: FormGroup;

  @Output() public confirm: EventEmitter<EntiteSimple> = new EventEmitter<
    EntiteSimple
  >();

  @Output() public back: EventEmitter<null> = new EventEmitter();

  public entityModeHelper = EntityModeHelper;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit() {
    this.loadComponent();
    if (!!this.object && !!this.object.id) {
      this.entityForm.setValue(this.object);
    }
  }

  loadComponent() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      this.componentType
    );

    const viewContainerRef = this.entitySubFormDirective.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);

    (componentRef.instance as EntitySubFormComponent).entityForm = this.entityForm;
  }

  public save(): void {
    this.confirm.emit(this.entityForm.value);
  }

  public cancel(): void {
    this.back.emit();
  }
}
