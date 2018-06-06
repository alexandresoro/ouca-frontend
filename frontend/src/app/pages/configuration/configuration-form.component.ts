import { Component, EventEmitter, Input, Output } from "@angular/core";
import { EntiteSimpleFormComponent } from "../entite-simple/entite-simple-form.component";
import { Departement } from "../../model/departement.object";
import { Observateur } from "../../model/observateur.object";
import { EstimationNombre } from "../../model/estimation-nombre.object";
import { Age } from "../../model/age.object";
import { Sexe } from "../../model/sexe.object";

@Component({
    selector: "configuration-form",
    templateUrl: "./configuration-form.tpl.html",
})
export class ConfigurationFormComponent {

    @Input() public observateurs: Observateur[];

    @Input() public departements: Departement[];

    @Input() public estimationsNombre: EstimationNombre[];

    @Input() public sexes: Sexe[];

    @Input() public ages: Age[];

    @Input() public model: any; // TODO    

    @Output() public confirm: EventEmitter<any> = new EventEmitter(); // TODO

    @Output() public back: EventEmitter<any> = new EventEmitter(); // TODO

    constructor() {
    }

    public save(): void {
        this.confirm.emit(this.model);
    }

    public cancel(): void {
        this.back.emit();
    }
}
