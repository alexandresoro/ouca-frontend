import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { AppConfiguration } from "basenaturaliste-model/app-configuration.object";
import { ConfigurationPage } from "basenaturaliste-model/configuration-page.object";
import { DbUpdateResult } from "basenaturaliste-model/db-update-result.object";
import * as _ from "lodash";
import { EntityModeHelper } from "../../../model-management/helpers/entity-mode.helper";
import { PageComponent } from "../../../shared/components/page.component";
import { BackendApiService } from "../../../shared/services/backend-api.service";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import { StatusMessageSeverity, StatusMessageComponent, StatusMessageParameters } from "../../../shared/components/status-message/status-message.component";

export interface IdPropriete {
  id: number;
  propriete: string;
}

export interface ProprieteValeur {
  propriete: string;
  valeur: string;
}

const PROPRIETES_A_AFFICHER: IdPropriete[] = [
  { id: 1, propriete: "Observateur par défaut" },
  { id: 2, propriete: "Département par défaut" },
  { id: 3, propriete: "Estimation du nombre par défaut" },
  { id: 4, propriete: "Nombre par défaut" },
  { id: 5, propriete: "Sexe par défaut" },
  { id: 6, propriete: "Âge par défaut" },
  { id: 7, propriete: "Afficher les observateurs associés" },
  { id: 8, propriete: "Afficher la météo" },
  { id: 9, propriete: "Afficher la distance" },
  { id: 10, propriete: "Afficher le numéro de regroupement" }
];

@Component({
  selector: "configuration",
  templateUrl: "./configuration.tpl.html"
})
export class ConfigurationComponent extends PageComponent implements OnInit {
  public pageModel: ConfigurationPage;

  public configurationToSave: AppConfiguration;

  public displayedColumns: string[] = ["propriete", "valeur"];
  public dataSource: MatTableDataSource<ProprieteValeur>;

  constructor(private backendApiService: BackendApiService,
    public snackbar: MatSnackBar
  ) {
    super();
  }

  public ngOnInit(): void {
    this.initConfigurationPage();
  }

  private initConfigurationPage(): void {
    this.switchToViewAllMode();
    this.getCurrentConfigurations();
  }

  public buildDataSource() {
    const dataSourceToBuild: ProprieteValeur[] = [];
    _.forEach(PROPRIETES_A_AFFICHER, (proprieteAAfficher) => {
      let valeurToSet: string;
      if (!this.configurationToSave) {
        valeurToSet = "";
      } else {
        switch (proprieteAAfficher.id) {
          case 1:
            valeurToSet = !!this.configurationToSave.defaultObservateur
              ? this.configurationToSave.defaultObservateur.libelle
              : "";
            break;
          case 2:
            valeurToSet = !!this.configurationToSave.defaultDepartement
              ? this.configurationToSave.defaultDepartement.code
              : "";
            break;
          case 3:
            valeurToSet = !!this.configurationToSave.defaultEstimationNombre
              ? this.configurationToSave.defaultEstimationNombre.libelle
              : "";
            break;
          case 4:
            valeurToSet = "" + this.configurationToSave.defaultNombre;
            break;
          case 5:
            valeurToSet = !!this.configurationToSave.defaultSexe
              ? this.configurationToSave.defaultSexe.libelle
              : "";
            break;
          case 6:
            valeurToSet = !!this.configurationToSave.defaultAge
              ? this.configurationToSave.defaultAge.libelle
              : "";
            break;
          case 7:
            valeurToSet = this.configurationToSave.areAssociesDisplayed
              ? "Oui"
              : "Non";
            break;
          case 8:
            valeurToSet = this.configurationToSave.isMeteoDisplayed
              ? "Oui"
              : "Non";
            break;
          case 9:
            valeurToSet = this.configurationToSave.isDistanceDisplayed
              ? "Oui"
              : "Non";
            break;
          case 10:
            valeurToSet = this.configurationToSave.isRegroupementDisplayed
              ? "Oui"
              : "Non";
            break;
          default:
            break;
        }
      }
      dataSourceToBuild.push({
        propriete: proprieteAAfficher.propriete,
        valeur: valeurToSet
      });
    });
    this.dataSource = new MatTableDataSource(dataSourceToBuild);
  }

  ////// CALLED FROM UI //////
  public refresh(): void {
    this.initConfigurationPage();
  }

  public editConfigurations(): void {
    this.switchToEditionMode();
  }

  public saveAppConfiguration(): void {
    console.log("App Configuration à sauvegarder", this.configurationToSave);

    this.backendApiService
      .saveAppConfiguration(this.configurationToSave)
      .subscribe(
        (result: DbUpdateResult) => {
          this.onSaveAppConfigurationSuccess(result);
        },
        (error: any) => {
          this.onSaveAppConfigurationError(error);
        }
      );
  }

  public cancelEdition(): void {
    this.switchToViewAllMode();
  }
  ////// END FROM UI //////

  private getCurrentConfigurations(): void {
    this.backendApiService.getConfigurationInitialPageModel().subscribe(
      (configurationPage: ConfigurationPage) => {
        this.onInitConfigurationPageSuccess(configurationPage);
      },
      (error: any) => {
        this.onInitConfigurationPageError(error);
      }
    );
  }

  private onInitConfigurationPageSuccess(
    configurationPage: ConfigurationPage
  ): void {
    this.pageModel = configurationPage;
    this.configurationToSave = configurationPage.appConfiguration;
    this.buildDataSource();
  }

  private onInitConfigurationPageError(error: any): void {
    this.openStatusMessage(
      "Impossible de charger la page de configuration.",
      StatusMessageSeverity.ERROR,
      error
    );
  }

  private onSaveAppConfigurationSuccess(saveResult: DbUpdateResult): void {
    this.openStatusMessage(
      "La sauvegarde des configurations de l'application a été faite avec succès.",
      StatusMessageSeverity.SUCCESS
    );
    this.getCurrentConfigurations();
    this.switchToViewAllMode();
  }

  private onSaveAppConfigurationError(error: any): void {
    this.openStatusMessage(
      "Impossible de sauvegarder la configuration de l'application.",
      StatusMessageSeverity.ERROR,
      error
    );
  }

  private switchToEditionMode(): void {
    EntityModeHelper.switchToEditionMode();
  }

  private switchToViewAllMode(): void {
    EntityModeHelper.switchToViewAllMode();
  }

  public getIsAllViewMode(): boolean {
    return EntityModeHelper.isViewAllMode();
  }

  public getIsEditionMode(): boolean {
    return EntityModeHelper.isEditionMode();
  }

  private openStatusMessage = (message: string, severity: StatusMessageSeverity, error?: any): void => {
    this.snackbar.openFromComponent(StatusMessageComponent, {
      data: {
        message: message,
        severity: severity,
        error: error
      },
      duration: 5000
    } as MatSnackBarConfig<StatusMessageParameters>);
  }
}
