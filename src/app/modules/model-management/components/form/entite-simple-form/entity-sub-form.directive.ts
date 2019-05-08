import { Directive, ViewContainerRef } from "@angular/core";

/**
 * EntitySubFormDirective injects ViewContainerRef to gain access
 * to the view container of the element that will host the dynamically added component
 */
@Directive({
  selector: "[entity-sub-form]"
})
export class EntitySubFormDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
