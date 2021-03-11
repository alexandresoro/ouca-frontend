import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Observable, Subject } from "rxjs";
import { COORDINATES_SYSTEMS_CONFIG } from 'src/app/model/coordinates-system/coordinates-system-list.object';
import { CoordinatesSystem } from 'src/app/model/coordinates-system/coordinates-system.object';
import { Age } from 'src/app/model/types/age.object';
import { AppConfiguration } from 'src/app/model/types/app-configuration.object';
import { Departement } from 'src/app/model/types/departement.object';
import { EntiteSimple } from 'src/app/model/types/entite-simple.object';
import { EstimationNombre } from 'src/app/model/types/estimation-nombre.object';
import { Observateur } from 'src/app/model/types/observateur.object';
import { Sexe } from 'src/app/model/types/sexe.object';
import { AppConfigurationService } from "src/app/services/app-configuration.service";
import { EntitiesStoreService } from "src/app/services/entities-store.service";

@Component({
  selector: "configuration-form",
  styleUrls: ["./configuration-form.component.scss"],
  templateUrl: "./configuration-form.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigurationFormComponent implements OnInit, OnDestroy {
  @Input() public appConfiguration: AppConfiguration;

  @Output() public confirm: EventEmitter<boolean> = new EventEmitter();

  @Output() public back: EventEmitter<boolean> = new EventEmitter();

  private readonly destroy$ = new Subject();

  public form: FormGroup;

  public observateurs$: Observable<Observateur[]>;

  public departements$: Observable<Departement[]>;

  public estimationsNombre$: Observable<EstimationNombre[]>;

  public sexes$: Observable<Sexe[]>;

  public ages$: Observable<Age[]>;

  constructor(
    private entitiesStoreService: EntitiesStoreService,
    private appConfigurationService: AppConfigurationService,
    private formBuilder: FormBuilder
  ) {
    this.observateurs$ = this.entitiesStoreService.getObservateurs$();
    this.departements$ = this.entitiesStoreService.getDepartements$();
    this.estimationsNombre$ = this.entitiesStoreService.getEstimationNombres$();
    this.sexes$ = this.entitiesStoreService.getSexes$();
    this.ages$ = this.entitiesStoreService.getAges$();

    this.form = this.formBuilder.group({
      id: "",
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
    this.form.reset(this.appConfiguration);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public coordinatesSystems: CoordinatesSystem[] = Object.values(
    COORDINATES_SYSTEMS_CONFIG
  );

  public save(): void {
    this.appConfigurationService
      .saveAppConfiguration(this.form.value)
      .subscribe((isSuccessful) => {
        this.confirm.emit(isSuccessful);
      });
  }

  public cancel(): void {
    this.back.emit();
  }

  public compareEntities(e1: EntiteSimple, e2: EntiteSimple): boolean {
    return e1 && e2 ? e1.id === e2.id : e1 === e2;
  }
}
