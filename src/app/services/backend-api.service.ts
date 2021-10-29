import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Donnee } from '../model/types/donnee.object';
import { DonneesFilter } from '../model/types/donnees-filter.object';
import { FlatDonnee } from '../model/types/flat-donnee.object';
import { Inventaire } from '../model/types/inventaire.object';
import { PostResponse } from '../model/types/post-response.object';

@Injectable({
  providedIn: "root"
})
export class BackendApiService {
  private DATABASE: string = "database/";
  private DELETE: string = "delete";
  private DONNEE: string = "donnee/";
  private EXPORT: string = "export";
  private FIND: string = "find";
  private INVENTAIRE: string = "inventaire/";
  private UPDATE: string = "update";
  private SAVE: string = "save";
  private CLEAR: string = "clear";
  private SEARCH: string = "search";

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

  private httpGetObserveResponse<T>(
    relativePath: string
  ): Observable<HttpResponse<any>> {
    const requestPath: string = this.getApiUrl() + relativePath;
    const httpOptions: Record<string, any> = {
      observe: "response",
      responseType: "blob" as "json"
    };
    return this.http.get<any>(requestPath, httpOptions).pipe(
      tap(() => {
        console.log("HTTP GET", requestPath);
      })
    );
  }

  private httpPostObserveResponse<T>(
    relativePath: string,
    objectToPost: any
  ): Observable<HttpResponse<any>> {
    const requestPath: string = this.getApiUrl() + relativePath;

    const httpOptions: Record<string, any> = {
      observe: "response",
      responseType: "blob" as "json"
    };
    return this.http.post<any>(requestPath, objectToPost, httpOptions).pipe(
      tap(() => {
        console.log("HTTP POST", requestPath, objectToPost);
      })
    );
  }

  private httpPost<T>(
    relativePath: string,
    objectToPost: any
  ): Observable<T> {
    const requestPath: string = this.getApiUrl() + relativePath;
    return this.http.post<T>(requestPath, objectToPost).pipe(
      tap(() => {
        console.log("HTTP POST", requestPath, objectToPost);
      })
    );
  }

  public exportData(entityName: string): Observable<HttpResponse<any>> {
    return this.httpGetObserveResponse(entityName + "/" + this.EXPORT);
  }

  public deleteDonnee(
    donneeId: number,
    inventaireId: number
  ): Observable<PostResponse> {
    return this.httpGet(
      this.DONNEE +
      this.DELETE +
      "?donneeId=" +
      donneeId +
      "&inventaireId=" +
      inventaireId
    );
  }

  public saveDonnee(donneeToSave: Donnee): Observable<PostResponse> {
    return this.httpPost(this.DONNEE + this.SAVE, donneeToSave);
  }

  public saveInventaire(
    inventaireToSave: Inventaire
  ): Observable<PostResponse> {
    return this.httpPost(this.INVENTAIRE + this.SAVE, inventaireToSave);
  }

  public getInventaireById(id: number): Observable<Inventaire> {
    return this.httpGet(this.INVENTAIRE + this.FIND + "?id=" + id);
  }

  public getDonneesByCustomizedFilters(
    parameters: DonneesFilter
  ): Observable<FlatDonnee[]> {
    return this.httpPost(this.DONNEE + this.SEARCH, parameters);
  }

  public exportDonneesByCustomizedFilters(
    parameters: DonneesFilter
  ): Observable<HttpResponse<any>> {
    return this.httpPostObserveResponse(this.DONNEE + this.EXPORT, parameters);
  }

  public saveDatabase(): Observable<HttpResponse<any>> {
    return this.httpGetObserveResponse(this.DATABASE + this.SAVE);
  }

  public updateDatabase(): Observable<void> {
    return this.httpGet(this.DATABASE + this.UPDATE);
  }

  public clearDatabase(): Observable<void> {
    return this.httpGet(this.DATABASE + this.CLEAR);
  }

  public getEspeceDetailsByAge = (
    especeId: number
  ): Observable<{ name: string; value: number }[]> => {
    return this.httpGet("espece/details_by_age?id=" + especeId);
  };

  public getEspeceDetailsBySexe = (
    especeId: number
  ): Observable<{ name: string; value: number }[]> => {
    return this.httpGet("espece/details_by_sexe?id=" + especeId);
  };

}
