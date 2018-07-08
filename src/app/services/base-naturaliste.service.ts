import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import {
  HttpClient,
  HttpResponse
} from "../../../node_modules/@angular/common/http";

@Injectable()
export class BaseNaturalisteService {
  public BASE_NATURALISTE_URL: string = "http://localhost:4000/api/";

  constructor(public http: HttpClient) {}

  public httpGet<T>(path: string): Observable<T> {
    return this.http.get<T>(this.BASE_NATURALISTE_URL + path);
  }

  public httpPost<T>(relativePath: string, objectToPost: any): Observable<T> {
    return this.http.post<T>(
      this.BASE_NATURALISTE_URL + relativePath,
      objectToPost
    );
  }
}
