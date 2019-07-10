import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { AppConfiguration } from "basenaturaliste-model/app-configuration.object";
import { ConfigurationPage } from "basenaturaliste-model/configuration-page.object";
import { DbUpdateResult } from "basenaturaliste-model/db-update-result.object";
import * as _ from "lodash";
import { EntityModeHelper } from "../../../model-management/helpers/entity-mode.helper";
import { PageComponent } from "../../../shared/components/page.component";
import { PageStatusHelper } from "../../../shared/helpers/page-status.helper";
import { BackendApiService } from "../../../shared/services/backend-api.service";

export interface IdPropriete {
  id: number;
  propriete: string;
}

export interface ProprieteValeur {
  propriete: string;
  valeur: string;
}

const PROPRIETES_A_AFFICHER: IdPropriete[] = [
  /*{ id: 1, propriete: "Nom de l'application" },*/
  { id: 2, propriete: "Observateur par défaut" },
  { id: 3, propriete: "Département par défaut" },
  { id: 4, propriete: "Estimation du nombre par défaut" },
  { id: 5, propriete: "Nombre par défaut" },
  { id: 6, propriete: "Sexe par défaut" },
  { id: 7, propriete: "Âge par défaut" },
  { id: 8, propriete: "Afficher les observateurs associés" },
  { id: 9, propriete: "Afficher la météo" },
  { id: 10, propriete: "Afficher la distance" },
  { id: 11, propriete: "Afficher le numéro de regroupement" },
  /*{ id: 12, propriete: "Chemin vers MySQL" },
  { id: 13, propriete: "Chemin vers MySQL dump" },
  { id: 14, propriete: "Dossier d'import" },
  { id: 15, propriete: "Dossier d'export" }*/
  { id: 15, propriete: "Dossier d'export" }
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

  constructor(private backendApiService: BackendApiService) {
    super();
  }

  public ngOnInit(): void {
    this.initConfigurationPage();
  }

  private initConfigurationPage(): void {
    PageStatusHelper.resetPageStatus();
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
            valeurToSet = this.configurationToSave.applicationName;
            break;
          case 2:
            valeurToSet = !!this.configurationToSave.defaultObservateur
              ? this.configurationToSave.defaultObservateur.libelle
              : "";
            break;
          case 3:
            valeurToSet = !!this.configurationToSave.defaultDepartement
              ? this.configurationToSave.defaultDepartement.code
              : "";
            break;
          case 4:
            valeurToSet = !!this.configurationToSave.defaultEstimationNombre
              ? this.configurationToSave.defaultEstimationNombre.libelle
              : "";
            break;
          case 5:
            valeurToSet = "" + this.configurationToSave.defaultNombre;
            break;
          case 6:
            valeurToSet = !!this.configurationToSave.defaultSexe
              ? this.configurationToSave.defaultSexe.libelle
              : "";
            break;
          case 7:
            valeurToSet = !!this.configurationToSave.defaultAge
              ? this.configurationToSave.defaultAge.libelle
              : "";
            break;
          case 8:
            valeurToSet = this.configurationToSave.areAssociesDisplayed
              ? "Oui"
              : "Non";
            break;
          case 9:
            valeurToSet = this.configurationToSave.isMeteoDisplayed
              ? "Oui"
              : "Non";
            break;
          case 10:
            valeurToSet = this.configurationToSave.isDistanceDisplayed
              ? "Oui"
              : "Non";
            break;
          case 11:
            valeurToSet = this.configurationToSave.isRegroupementDisplayed
              ? "Oui"
              : "Non";
            break;
          case 12:
            valeurToSet = this.configurationToSave.mySqlPath;
            break;
          case 13:
            valeurToSet = this.configurationToSave.mySqlDumpPath;
            break;
          case 14:
            valeurToSet = this.configurationToSave.importFolderPath;
            break;
          case 15:
            valeurToSet = this.configurationToSave.exportFolderPath;
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
    PageStatusHelper.resetPageStatus();
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
    PageStatusHelper.setErrorStatus(
      "Impossible de charger la page de configuration.",
      error
    );
  }

  private onSaveAppConfigurationSuccess(saveResult: DbUpdateResult): void {
    PageStatusHelper.setSuccessStatus(
      "La sauvegarde des configurations de l'application a été faite avec succès."
    );
    this.getCurrentConfigurations();
    this.switchToViewAllMode();
  }

  private onSaveAppConfigurationError(error: any): void {
    PageStatusHelper.setErrorStatus(
      "Impossible de sauvegarder la configuration de l'application.",
      error
    );
  }

  private switchToEditionMode(): void {
    PageStatusHelper.resetPageStatus();
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
}
