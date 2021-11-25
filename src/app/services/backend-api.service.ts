import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class BackendApiService {
  private DATABASE: string = "database/";
  private CLEAR: string = "clear";

  constructor(public http: HttpClient
  ) { }

  private getApiUrl = (): string => {
    return (
      window.location.protocol +
      "//" +
      window.location.hostname +
      ":" +
      window.location.port +
      "/api/"
    );
  };

  private httpGet<T>(relativePath: string): Observable<T> {
    const requestPath: string = this.getApiUrl() + relativePath;
    return this.http.get<T>(requestPath).pipe(
      tap(() => {
        console.log("HTTP GET ", requestPath);
      })
    );
  }

  public clearDatabase(): Observable<void> {
    return this.httpGet(this.DATABASE + this.CLEAR);
  }

}
