import { Component } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { BaseNaturalisteService } from "../../services/base-naturaliste.service";
import { GestionMode, GestionModeHelper } from "../entities/gestion-mode.enum";
import { ConfigurationPage } from "./../../model/configuration-page.object";

@Component({
    templateUrl: "./configuration.tpl.html"
})
export class ConfigurationComponent {

    public pageModel: ConfigurationPage;

    public configurationToSave: any; // TODO create object model

    public mode: GestionMode;

    public messages: any[];

    public status: string;

    constructor(public http: Http,
                public modeHelper: GestionModeHelper) {
        super(http);
    }

    public ngOnInit(): void {
        this.switchToViewAllMode();
        this.getCurrentConfigurations();
    }

    ////// CALLED FROM UI //////
    public refresh(): void {
        this.getCurrentConfigurations();
    }

    public editConfigurations(): void {
        this.switchToEditionMode();
    }

    public saveConfigurations(configuration: any): void {
        // TODO
    }

    public cancelEdition(): void {
        this.clearMessages();
        this.switchToViewAllMode();
    }
    ////// END FROM UI //////

    private getCurrentConfigurations(): void {
        this.callBackend("/configuration/init");

        this.creationService.getInitialPageModel()
            .subscribe(
                (creationPage: CreationPage) => {
                    this.onInitCreationPageSucces(creationPage);
                },
                (error: any) => {
                    this.onInitCreationPageError(error);
                });
    }

    private switchToEditionMode(): void {
        this.clearMessages();
        this.mode = GestionMode.EDITION;
    }

    private switchToViewAllMode(): void {
        this.mode = GestionMode.VIEW_ALL;
    }

    private clearMessages(): void {
        this.messages = [];
    }
}
