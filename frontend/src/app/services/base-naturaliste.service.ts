import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { ErrorObservable } from "rxjs/observable/ErrorObservable";

@Injectable()
export class BaseNaturalisteService {

  public BASE_NATURALISTE_URL: string = "http://localhost:4000/api/";

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

  public handleError(error: any): ErrorObservable {
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
