import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";

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
    console.log("Modèle retourné par le serveur:", res.json());
    return res.json();
  }

  public handleError(error: any): any {
    return error.json();
  }

}
