import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";
import { AppConfiguration } from "../../model/app-configuration.object";
import { ConfigurationPage } from "../../model/configuration-page.object";
import { EntiteResult } from "../../model/entite-result.object";
import { BaseNaturalisteService } from "../../services/base-naturaliste.service";

@Injectable()
export class ConfigurationService extends BaseNaturalisteService {

  private PAGE_PATH: string = "configuration";
  private INIT_PATH: string = "/init";

  constructor(public http: Http) {
    super(http);
  }

  public getInitialPageModel(): Observable<ConfigurationPage> {
    return this.httpGet(this.PAGE_PATH + this.INIT_PATH);
  }

  public saveAppConfiguration(appConfigurationToSave: AppConfiguration): Observable<EntiteResult<AppConfiguration>> {
    return null;
    // TODO
  }

}
