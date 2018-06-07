import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";
import { ErrorObservable } from "rxjs/observable/ErrorObservable";
import { ConfigurationPage } from "../../model/configuration-page.object";
import { CreationPage } from "../../model/creation-page.object";
import { Donnee } from "../../model/donnee.object";
import { Lieudit } from "../../model/lieudit.object";
import { Comportement } from "./../../model/comportement.object";
import { EntiteResult } from "./../../model/entite-result.object";
import { BaseNaturalisteService } from "./../../services/base-naturaliste.service";

@Injectable()
export class CreationService extends BaseNaturalisteService {

  private PATH: string = this.BASE_NATURALISTE_URL + "configuration";
  private INIT_PATH: string = "/init";

  constructor(private http: Http) {
    super();
  }

  public getInitialPageModel(): Observable<ConfigurationPage> {
    return this.http.get(this.PATH + this.INIT_PATH)
      .map(this.extractModel)
      .catch(this.handleError);
  }

  private extractModel(res: Response): ConfigurationPage {
    return res.json();
  }

}
