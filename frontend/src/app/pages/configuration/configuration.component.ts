import { Component } from "@angular/core";
import { Http, Response } from "@angular/http";
import { ConfigurationPage } from "./../../model/configuration-page.object";
import { GestionModeHelper, GestionMode } from "../entities/gestion-mode.enum";

@Component({
    templateUrl: "./configuration.tpl.html"
})
export class ConfigurationComponent {

    public pageModel: ConfigurationPage;

    public configurationToSave: any; // TODO create object model

    public mode: GestionMode;

    public messages: any[];

    public status: string;

    constructor(private _http: Http,
                public modeHelper: GestionModeHelper) {
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
        // TODO call back end
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
