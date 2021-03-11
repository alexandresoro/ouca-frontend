import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import * as _ from "lodash";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { COORDINATES_SYSTEMS_CONFIG } from 'src/app/model/coordinates-system/coordinates-system-list.object';
import { AppConfiguration } from 'src/app/model/types/app-configuration.object';
import { AppConfigurationService } from "src/app/services/app-configuration.service";

export enum ConfigurationParameterID {
  DEFAULT_OBSERVATEUR,
  DEFAULT_DEPARTEMENT,
  DEFAULT_ESTIMATION_NOMBRE,
  DEFAULT_NOMBRE,
  DEFAULT_SEXE,
  DEFAULT_AGE,
  DISPLAY_ASSOCIES,
  DISPLAY_METEO,
  DISPLAY_REGROUPEMENT,
  DISPLAY_DISTANCE,
  COORDINATES_SYSTEM
}

export interface ConfigurationParameter {
  id: ConfigurationParameterID;
  label: string;
  value: string;
}

@Component({
  selector: "configuration",
  styleUrls: ["./configuration.component.scss"],
  templateUrl: "./configuration.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigurationComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject();

  public isCurrentlyEditing$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  public appConfiguration$: Observable<AppConfiguration>;

  private readonly configurationParametersToDisplay: ConfigurationParameter[] = [
    {
      id: ConfigurationParameterID.DEFAULT_OBSERVATEUR,
      label: "Observateur par défaut",
      value: ""
    },
    {
      id: ConfigurationParameterID.DEFAULT_DEPARTEMENT,
      label: "Département par défaut",
      value: ""
    },
    {
      id: ConfigurationParameterID.DEFAULT_ESTIMATION_NOMBRE,
      label: "Estimation du nombre par défaut",
      value: ""
    },
    {
      id: ConfigurationParameterID.DEFAULT_NOMBRE,
      label: "Nombre par défaut",
      value: ""
    },
    {
      id: ConfigurationParameterID.DEFAULT_SEXE,
      label: "Sexe par défaut",
      value: ""
    },
    {
      id: ConfigurationParameterID.DEFAULT_AGE,
      label: "Âge par défaut",
      value: ""
    },
    {
      id: ConfigurationParameterID.DISPLAY_ASSOCIES,
      label: "Afficher les observateurs associés",
      value: "Non"
    },
    {
      id: ConfigurationParameterID.DISPLAY_METEO,
      label: "Afficher la météo",
      value: "Non"
    },
    {
      id: ConfigurationParameterID.DISPLAY_DISTANCE,
      label: "Afficher la distance",
      value: "Non"
    },
    {
      id: ConfigurationParameterID.DISPLAY_REGROUPEMENT,
      label: "Afficher le numéro de regroupement",
      value: "Non"
    },
    {
      id: ConfigurationParameterID.COORDINATES_SYSTEM,
      label: "Système de coordonnées",
      value: ""
    }
  ];

  public displayedColumns: string[] = ["label", "value"];

  public dataSource: MatTableDataSource<ConfigurationParameter>;

  constructor(private appConfigurationService: AppConfigurationService) {
    this.appConfiguration$ = this.appConfigurationService.getConfiguration$();
  }

  public ngOnInit(): void {
    this.dataSource = new MatTableDataSource(
      this.configurationParametersToDisplay
    );
    this.switchToViewAllMode();
    this.appConfiguration$
      .pipe(takeUntil(this.destroy$))
      .subscribe((appConfiguration) => {
        if (appConfiguration) {
          this.buildDataSource(appConfiguration);
        }
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public buildDataSource = (appConfiguration: AppConfiguration): void => {
    const newConfiguration = _.map(
      this.configurationParametersToDisplay,
      (parameter) => {
        let value = "";
        if (appConfiguration) {
          switch (parameter.id) {
            case ConfigurationParameterID.DEFAULT_OBSERVATEUR:
              value = appConfiguration.defaultObservateur
                ? appConfiguration.defaultObservateur.libelle
                : "";
              break;
            case ConfigurationParameterID.DEFAULT_DEPARTEMENT:
              value = appConfiguration.defaultDepartement
                ? appConfiguration.defaultDepartement.code
                : "";
              break;
            case ConfigurationParameterID.COORDINATES_SYSTEM:
              value = appConfiguration.coordinatesSystem
                ? COORDINATES_SYSTEMS_CONFIG[appConfiguration.coordinatesSystem]
                  .name
                : "";
              break;
            case ConfigurationParameterID.DEFAULT_ESTIMATION_NOMBRE:
              value = appConfiguration.defaultEstimationNombre
                ? appConfiguration.defaultEstimationNombre.libelle
                : "";
              break;
            case ConfigurationParameterID.DEFAULT_NOMBRE:
              value = appConfiguration.defaultNombre
                ? "" + appConfiguration.defaultNombre
                : "";
              break;
            case ConfigurationParameterID.DEFAULT_SEXE:
              value = appConfiguration.defaultSexe
                ? appConfiguration.defaultSexe.libelle
                : "";
              break;
            case ConfigurationParameterID.DEFAULT_AGE:
              value = appConfiguration.defaultAge
                ? appConfiguration.defaultAge.libelle
                : "";
              break;
            case ConfigurationParameterID.DISPLAY_ASSOCIES:
              value = appConfiguration.areAssociesDisplayed ? "Oui" : "Non";
              break;
            case ConfigurationParameterID.DISPLAY_METEO:
              value = appConfiguration.isMeteoDisplayed ? "Oui" : "Non";
              break;
            case ConfigurationParameterID.DISPLAY_DISTANCE:
              value = appConfiguration.isDistanceDisplayed ? "Oui" : "Non";
              break;
            case ConfigurationParameterID.DISPLAY_REGROUPEMENT:
              value = appConfiguration.isRegroupementDisplayed ? "Oui" : "Non";
              break;
            default:
              break;
          }
        }
        return {
          id: parameter.id,
          label: parameter.label,
          value
        };
      }
    );
    this.dataSource.data = newConfiguration;
  };

  public saveAppConfiguration = (isSuccessfulSave: boolean): void => {
    if (isSuccessfulSave) {
      this.switchToViewAllMode();
    }
  };

  public switchToEditionMode = (): void => {
    this.isCurrentlyEditing$.next(true);
  };

  public switchToViewAllMode = (): void => {
    this.isCurrentlyEditing$.next(false);
  };
}
