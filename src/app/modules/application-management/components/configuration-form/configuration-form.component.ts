import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Age } from "ouca-common/age.object";
import { AppConfiguration } from "ouca-common/app-configuration.object";
import {
  CoordinatesSystem,
  COORDINATES_SYSTEMS_CONFIG
} from "ouca-common/coordinates-system";
import { Departement } from "ouca-common/departement.object";
import { EntiteSimple } from "ouca-common/entite-simple.object";
import { EstimationNombre } from "ouca-common/estimation-nombre.object";
import { Observateur } from "ouca-common/observateur.object";
import { Sexe } from "ouca-common/sexe.object";
import { Observable } from "rxjs";
import { CreationPageModelService } from "src/app/services/creation-page-model.service";

@Component({
  selector: "configuration-form",
  styleUrls: ["./configuration-form.component.scss"],
  templateUrl: "./configuration-form.component.html"
})
export class ConfigurationFormComponent {
  @Input() public appConfiguration: AppConfiguration;

  @Output() public confirm: EventEmitter<AppConfiguration> = new EventEmitter();

  @Output() public back: EventEmitter<boolean> = new EventEmitter();

  public form: FormGroup;

  public observateurs$: Observable<Observateur[]>;

  public departements$: Observable<Departement[]>;

  public estimationsNombre$: Observable<EstimationNombre[]>;

  public sexes$: Observable<Sexe[]>;

  public ages$: Observable<Age[]>;

  constructor(
    private creationPageModelService: CreationPageModelService,
    private formBuilder: FormBuilder
  ) {
    this.observateurs$ = this.creationPageModelService.getObservateurs$();
    this.departements$ = this.creationPageModelService.getDepartements$();
    this.estimationsNombre$ = this.creationPageModelService.getEstimationNombres$();
    this.sexes$ = this.creationPageModelService.getSexes$();
    this.ages$ = this.creationPageModelService.getAges$();

    this.form = this.formBuilder.group({
      defaultObservateur: "",
      defaultDepartement: "",
      defaultEstimationNombre: "",
      defaultNombre: "",
      defaultSexe: "",
      defaultAge: "",
      areAssociesDisplayed: "",
      isMeteoDisplayed: "",
      isDistanceDisplayed: "",
      isRegroupementDisplayed: "",
      coordinatesSystem: ""
    });
  }

  ngOnInit(): void {
    this.form.setValue(this.appConfiguration);
  }

  public coordinatesSystems: CoordinatesSystem[] = Object.values(
    COORDINATES_SYSTEMS_CONFIG
  );

  public save(): void {
    this.confirm.emit(this.form.value);
  }

  public cancel(): void {
    this.back.emit();
  }

  public compareEntities(e1: EntiteSimple, e2: EntiteSimple): boolean {
    return e1 && e2 ? e1.id === e2.id : e1 === e2;
  }
}
