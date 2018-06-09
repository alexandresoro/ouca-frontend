import { Component } from "@angular/core";
import { Age } from "../../../model/age.object";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
    templateUrl: "./age.tpl.html",
})
export class AgeComponent extends EntiteSimpleComponent<Age> {

    public getEntityName(): string {
        return "age";
    }

    public getNewObject(): Age {
        return new Age();
    }
}
