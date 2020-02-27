import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Age } from "ouca-common/age.object";
import { AppConfiguration } from "ouca-common/app-configuration.object";
import { CoordinatesSystem } from "ouca-common/coordinates-system";
import { Departement } from "ouca-common/departement.object";
import { EntiteSimple } from "ouca-common/entite-simple.object";
import { EstimationNombre } from "ouca-common/estimation-nombre.object";
import { Observateur } from "ouca-common/observateur.object";
import { Sexe } from "ouca-common/sexe.object";

@Component({
  selector: "configuration-form",
  styleUrls: ["./configuration-form.component.scss"],
  templateUrl: "./configuration-form.tpl.html"
})
export class ConfigurationFormComponent {
  @Input() public observateurs: Observateur[];

  @Input() public departements: Departement[];

  @Input() public coordinatesSystems: CoordinatesSystem[];

  @Input() public estimationsNombre: EstimationNombre[];

  @Input() public sexes: Sexe[];

  @Input() public ages: Age[];

  @Input() public model: AppConfiguration;

  @Output() public confirm: EventEmitter<AppConfiguration> = new EventEmitter();

  @Output() public back: EventEmitter<boolean> = new EventEmitter();

  public save(): void {
    this.confirm.emit(this.model);
  }

  public cancel(): void {
    this.back.emit();
  }

  public compareEntities(e1: EntiteSimple, e2: EntiteSimple): boolean {
    return e1 && e2 ? e1.id === e2.id : e1 === e2;
  }
}
