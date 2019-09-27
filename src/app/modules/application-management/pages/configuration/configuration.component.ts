import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { AppConfiguration } from "basenaturaliste-model/app-configuration.object";
import { ConfigurationPage } from "basenaturaliste-model/configuration-page.object";
import { DbUpdateResult } from "basenaturaliste-model/db-update-result.object";
import * as _ from "lodash";
import { EntityModeHelper } from "../../../model-management/helpers/entity-mode.helper";
import { BackendApiService } from "../../../shared/services/backend-api.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { PageComponent } from "../../../shared/pages/page.component";

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
  DISPLAY_DISTANCE
}

export interface ConfigurationParameter {
  id: ConfigurationParameterID;
  label: string;
  value: string;
}

@Component({
  selector: "configuration",
  templateUrl: "./configuration.tpl.html"
})
export class ConfigurationComponent extends PageComponent implements OnInit {
  private configurationParametersToDisplay: ConfigurationParameter[];
  public pageModel: ConfigurationPage;

  public configurationToSave: AppConfiguration;

  public displayedColumns: string[] = ["label", "value"];

  public dataSource: MatTableDataSource<ConfigurationParameter>;

  constructor(
    private backendApiService: BackendApiService,
    protected snackbar: MatSnackBar
  ) {
    super(snackbar);
  }

  public ngOnInit(): void {
    this.initConfigurationPage();
  }

  private initConfigurationPage = (): void => {
    this.configurationParametersToDisplay = [
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
      }
    ];
    this.switchToViewAllMode();
    this.getCurrentConfiguration();
  };

  public buildDataSource = (): void => {
    _.forEach(this.configurationParametersToDisplay, (parameter) => {
      let value: string = "";
      if (this.configurationToSave) {
        switch (parameter.id) {
          case ConfigurationParameterID.DEFAULT_OBSERVATEUR:
            value = this.configurationToSave.defaultObservateur
              ? this.configurationToSave.defaultObservateur.libelle
              : "";
            break;
          case ConfigurationParameterID.DEFAULT_DEPARTEMENT:
            value = this.configurationToSave.defaultDepartement
              ? this.configurationToSave.defaultDepartement.code
              : "";
            break;
          case ConfigurationParameterID.DEFAULT_ESTIMATION_NOMBRE:
            value = this.configurationToSave.defaultEstimationNombre
              ? this.configurationToSave.defaultEstimationNombre.libelle
              : "";
            break;
          case ConfigurationParameterID.DEFAULT_NOMBRE:
            value = "" + this.configurationToSave.defaultNombre;
            break;
          case ConfigurationParameterID.DEFAULT_SEXE:
            value = this.configurationToSave.defaultSexe
              ? this.configurationToSave.defaultSexe.libelle
              : "";
            break;
          case ConfigurationParameterID.DEFAULT_AGE:
            value = this.configurationToSave.defaultAge
              ? this.configurationToSave.defaultAge.libelle
              : "";
            break;
          case ConfigurationParameterID.DISPLAY_ASSOCIES:
            value = this.configurationToSave.areAssociesDisplayed
              ? "Oui"
              : "Non";
            break;
          case ConfigurationParameterID.DISPLAY_METEO:
            value = this.configurationToSave.isMeteoDisplayed ? "Oui" : "Non";
            break;
          case ConfigurationParameterID.DISPLAY_DISTANCE:
            value = this.configurationToSave.isDistanceDisplayed
              ? "Oui"
              : "Non";
            break;
          case ConfigurationParameterID.DISPLAY_REGROUPEMENT:
            value = this.configurationToSave.isRegroupementDisplayed
              ? "Oui"
              : "Non";
            break;
          default:
            break;
        }
      }
      parameter.value = value;
    });
    this.dataSource = new MatTableDataSource(
      this.configurationParametersToDisplay
    );
  };

  public refresh = (): void => {
    this.initConfigurationPage();
  };

  public editConfigurations = (): void => {
    this.switchToEditionMode();
  };

  public saveAppConfiguration = (): void => {
    this.backendApiService
      .saveAppConfiguration(this.configurationToSave)
      .subscribe(
        (dbResults: DbUpdateResult[]) => {
          this.onSaveAppConfigurationSuccess(dbResults);
        },
        (error: any) => {
          this.onSaveAppConfigurationError(error);
        }
      );
  };

  public cancelEdition = (): void => {
    this.switchToViewAllMode();
  };

  private getCurrentConfiguration = (): void => {
    this.backendApiService.getConfigurationInitialPageModel().subscribe(
      (configurationPage: ConfigurationPage) => {
        this.onInitConfigurationPageSuccess(configurationPage);
      },
      (error: any) => {
        this.onInitConfigurationPageError(error);
      }
    );
  };

  private onInitConfigurationPageSuccess = (
    configurationPage: ConfigurationPage
  ): void => {
    this.pageModel = configurationPage;
    this.configurationToSave = configurationPage.appConfiguration;
    this.buildDataSource();
  };

  private onInitConfigurationPageError = (error: any): void => {
    this.showErrorMessage(
      "Impossible de charger le contenu de la page de configuration.",
      error
    );
  };

  private onSaveAppConfigurationSuccess = (
    dbResults: DbUpdateResult[]
  ): void => {
    if (this.isSaveConfigurationSuccess(dbResults)) {
      this.showSuccessMessage(
        "La configuration de l'application a été mise à jour."
      );
      this.getCurrentConfiguration();
      this.switchToViewAllMode();
    } else {
      this.showErrorMessage(
        "Il semble qu'une erreur soit survenue pendant la sauvegarde de la configuration.",
        dbResults
      );
    }
  };

  private isSaveConfigurationSuccess = (
    dbResults: DbUpdateResult[]
  ): boolean => {
    let isSuccess: boolean = true;
    for (const dbResult of dbResults) {
      isSuccess = isSuccess || dbResult.affectedRows === 1;
    }
    return isSuccess;
  };

  private onSaveAppConfigurationError = (error: any): void => {
    this.showErrorMessage(
      "Impossible de sauvegarder la configuration de l'application.",
      error
    );
  };

  private switchToEditionMode = (): void => {
    EntityModeHelper.switchToEditionMode();
  };

  private switchToViewAllMode = (): void => {
    EntityModeHelper.switchToViewAllMode();
  };

  public getIsAllViewMode = (): boolean => {
    return EntityModeHelper.isViewAllMode();
  };

  public getIsEditionMode = (): boolean => {
    return EntityModeHelper.isEditionMode();
  };
}
