import {
  ChangeDetectionStrategy,
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
import { EntityModeHelper } from "../../../helpers/entity-mode.helper";
import { EntitySubFormComponent } from "./entity-sub-form.component";
import { EntitySubFormDirective } from "./entity-sub-form.directive";

@Component({
  selector: "entity-form",
  styleUrls: ["./entity-form.component.scss"],
  templateUrl: "./entity-form.tpl.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntityFormComponent<T extends { id: number | null }> implements OnInit {
  @Input() componentType: Type<EntitySubFormComponent<T>>;

  @ViewChild(EntitySubFormDirective, { static: true })
  entitySubFormDirective: EntitySubFormDirective;

  @Input() public isEditionMode: boolean;

  @Input() public creationTitle: string;

  @Input() public editionTitle: string;

  @Input() public entityForm: FormGroup;

  @Output() public confirm: EventEmitter<T> = new EventEmitter<
    T
  >();

  @Output() public back: EventEmitter<null> = new EventEmitter();

  public entityModeHelper = EntityModeHelper;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {
    this.loadComponent();
  }

  private loadComponent = (): void => {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      this.componentType
    );

    const viewContainerRef = this.entitySubFormDirective.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);

    componentRef.instance.entityForm = this.entityForm;
  };

  public save = (): void => {
    this.confirm.emit(this.entityForm.value);
  };

  public cancel = (): void => {
    this.back.emit();
  };
}
