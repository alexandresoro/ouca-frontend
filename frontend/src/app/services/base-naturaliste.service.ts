import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";
import { ErrorObservable } from "rxjs/observable/ErrorObservable";
import { CreationPage } from "../model/creation-page.object";
import { Donnee } from "../model/donnee.object";

@Injectable()
export class BaseNaturalisteService {

  public BASE_NATURALISTE_URL: string = "http://localhost:3000/api/";

  constructor(public http: Http) {

  }

  public callBackend<T>(path: string): Observable<T> {
    return this.http.get(this.BASE_NATURALISTE_URL + path)
      .map(this.extractModel)
      .catch(this.handleError);
  }

  public extractModel(res: Response): any {
    return res.json();

  }

  protected handleError(error: any): ErrorObservable {
    // In a real world app, you might use a remote logging infrastructure
    const errMsg: string = "";
    /*
    if (error instanceof Response) {
        const body = error.json() || "";
        const err = body.error || JSON.stringify(body);
        errMsg = `${error.status} - ${error.statusText || ""} ${err}`;
    } else {
        errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    */
    return Observable.throw(errMsg);
  }

}
