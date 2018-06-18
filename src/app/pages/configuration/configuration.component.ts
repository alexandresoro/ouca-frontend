import { Component, OnInit } from "@angular/core";
import { AppConfiguration } from "../../model/app-configuration.object";
import { ConfigurationPage } from "../../model/configuration-page.object";
import { EntiteResult } from "../../model/entite-result.object";
import { GestionMode, GestionModeHelper } from "../entities/gestion-mode.enum";
import { PageComponent } from "../page.component";
import { ConfigurationService } from "./configuration.service";

@Component({
    templateUrl: "./configuration.tpl.html"
})
export class ConfigurationComponent extends PageComponent implements OnInit {

    public pageModel: ConfigurationPage;

    public configurationToSave: AppConfiguration;

    public mode: GestionMode;

    constructor(private configurationService: ConfigurationService,
                public modeHelper: GestionModeHelper) {
        super();
    }

    public ngOnInit(): void {
        this.switchToViewAllMode();
        this.getCurrentConfigurations();
    }

    ////// CALLED FROM UI //////
    public refresh(): void {
        this.ngOnInit();
    }

    public editConfigurations(): void {
        this.switchToEditionMode();
    }

    public saveAppConfiguration(): void {
        console.log("App Configuration à sauvegarder", this.configurationToSave);

        this.configurationService.saveAppConfiguration(this.configurationToSave)
            .subscribe(
                (result: EntiteResult<AppConfiguration>) => {
                    this.updatePageStatus(result.status, result.messages);
                    if (this.isSuccess()) {
                        this.onSaveAppConfigurationSuccess(result.object);
                    }
                },
                (error: any) => {
                    this.onSaveAppConfigurationError(error);
                });
    }

    public cancelEdition(): void {
        this.clearMessages();
        this.switchToViewAllMode();
    }
    ////// END FROM UI //////

    private getCurrentConfigurations(): void {
        this.configurationService.getInitialPageModel()
            .subscribe(
                (configurationPage: ConfigurationPage) => {
                    this.onInitConfigurationPageSuccess(configurationPage);
                },
                (error: any) => {
                    this.onInitConfigurationPageError(error);
                });
    }

    private onInitConfigurationPageSuccess(configurationPage: ConfigurationPage): void {
        this.pageModel = configurationPage;
        this.configurationToSave = configurationPage.appConfiguration;
    }

    private onInitConfigurationPageError(error: any): void {
        console.log("Impossible de charger la page de configuration.", error);
        this.setErrorMessage("Impossible de charger la page de configuration.");
    }

    private onSaveAppConfigurationSuccess(appConfiguration: AppConfiguration): void {
        this.configurationToSave = appConfiguration;
        this.switchToViewAllMode();
    }

    private onSaveAppConfigurationError(error: any): void {
        console.log("Impossible de sauvegarder la configuration de l'application.", error);
        this.setErrorMessage("Impossible de sauvegarder la configuration de l'application.");
    }

    private switchToEditionMode(): void {
        this.clearMessages();
        this.mode = GestionMode.EDITION;
    }

    private switchToViewAllMode(): void {
        this.mode = GestionMode.VIEW_ALL;
    }
}
