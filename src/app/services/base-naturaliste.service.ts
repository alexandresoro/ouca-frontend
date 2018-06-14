import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable()
export class BaseNaturalisteService {

  public BASE_NATURALISTE_URL: string = "http://localhost:4000/api/";

  constructor(public http: Http) {

  }

  public callBackend<T>(path: string): Observable<T> {
    return this.http.get(this.BASE_NATURALISTE_URL + path).pipe(
      map(this.extractModel),
      catchError(this.handleError)
    );
  }

  public extractModel(res: Response): any {
    console.log("Modèle retourné par le serveur:", res.json());
    return res.json();
  }

  public handleError(error: any): any {
    return error.json();
  }

}
