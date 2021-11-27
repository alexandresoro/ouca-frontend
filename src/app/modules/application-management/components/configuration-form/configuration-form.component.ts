import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ApolloQueryResult } from "@apollo/client/core";
import { Apollo, gql } from "apollo-angular";
import { Observable, Subject } from "rxjs";
import { map, takeUntil } from "rxjs/operators";
import { COORDINATES_SYSTEMS_CONFIG } from 'src/app/model/coordinates-system/coordinates-system-list.object';
import { CoordinatesSystem } from 'src/app/model/coordinates-system/coordinates-system.object';
import { Age, Departement, EstimationNombre, InputSettings, Observateur, Sexe } from "src/app/model/graphql";
import { AppConfigurationGetService } from "src/app/services/app-configuration-get.service";
import { AppConfigurationUpdateService } from "src/app/services/app-configuration-update.service";
import { StatusMessageService } from "src/app/services/status-message.service";

type ConfigurationFormQueryResult = {
  ages: Age[],
  observateurs: Observateur[],
  departements: Departement[],
  estimationsNombre: EstimationNombre[],
  sexes: Sexe[]
}

const CONFIGURATION_FORM_QUERY = gql`
  query {
    ages {
      id
      libelle
    }
    departements {
      id
      code
    }
    estimationsNombre {
      id
      libelle
      nonCompte
    }
    observateurs {
      id
      libelle
    }
    sexes {
      id
      libelle
    }
  }
`;

@Component({
  selector: "configuration-form",
  styleUrls: ["./configuration-form.component.scss"],
  templateUrl: "./configuration-form.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigurationFormComponent implements OnInit, OnDestroy {

  @Output() public confirm: EventEmitter<boolean> = new EventEmitter();

  @Output() public back: EventEmitter<boolean> = new EventEmitter();

  private readonly destroy$ = new Subject();

  private configurationFormQuery$: Observable<ApolloQueryResult<ConfigurationFormQueryResult>>;

  public form: FormGroup;

  public observateurs$: Observable<Observateur[]>;

  public departements$: Observable<Departement[]>;

  public estimationsNombre$: Observable<EstimationNombre[]>;

  public sexes$: Observable<Sexe[]>;

  public ages$: Observable<Age[]>;

  constructor(
    private statusMessageService: StatusMessageService,
    private appConfigurationGetService: AppConfigurationGetService,
    private appConfigurationUpdateService: AppConfigurationUpdateService,
    private apollo: Apollo,
    private formBuilder: FormBuilder
  ) {

    this.configurationFormQuery$ = this.apollo.watchQuery<ConfigurationFormQueryResult>({
      query: CONFIGURATION_FORM_QUERY
    }).valueChanges.pipe(
      takeUntil(this.destroy$)
    );

    this.observateurs$ = this.configurationFormQuery$.pipe(
      map(({ data }) => data?.observateurs)
    );
    this.departements$ = this.configurationFormQuery$.pipe(
      map(({ data }) => data?.departements)
    );
    this.estimationsNombre$ = this.configurationFormQuery$.pipe(
      map(({ data }) => data?.estimationsNombre)
    );
    this.sexes$ = this.configurationFormQuery$.pipe(
      map(({ data }) => data?.sexes)
    );
    this.ages$ = this.configurationFormQuery$.pipe(
      map(({ data }) => data?.ages)
    );

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
    this.appConfigurationGetService.fetch().subscribe(({ data }) => {

      const { defaultObservateur, defaultDepartement, defaultEstimationNombre, defaultAge, defaultSexe } = data?.settings || {};

      this.form.reset({
        ...data?.settings,
        defaultObservateur: defaultObservateur?.id,
        defaultDepartement: defaultDepartement?.id,
        defaultEstimationNombre: defaultEstimationNombre?.id,
        defaultAge: defaultAge?.id,
        defaultSexe: defaultSexe?.id
      })
    })
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public coordinatesSystems: CoordinatesSystem[] = Object.values(
    COORDINATES_SYSTEMS_CONFIG
  );

  public save(): void {
    this.appConfigurationUpdateService.mutate(
      { inputSettings: this.form.value as InputSettings }
    ).subscribe(({ data }) => {
      if (data?.updateSettings) {
        this.statusMessageService.showSuccessMessage(
          "La configuration de l'application a été mise à jour."
        );
      } else {
        this.statusMessageService.showErrorMessage(
          "Une erreur est survenue pendant la sauvegarde de la configuration."
        );
      }
      this.confirm.emit(!!data?.updateSettings);
    });
  }

  public cancel(): void {
    this.back.emit();
  }

}
