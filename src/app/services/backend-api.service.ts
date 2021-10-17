import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { Donnee } from '../model/types/donnee.object';
import { DonneesFilter } from '../model/types/donnees-filter.object';
import { EntiteSimple } from '../model/types/entite-simple.object';
import { FlatDonnee } from '../model/types/flat-donnee.object';
import { Inventaire } from '../model/types/inventaire.object';
import { PostResponse } from '../model/types/post-response.object';
import { ENTITIES_PROPERTIES } from "../modules/model-management/models/entities-properties.model";
import { StatusMessageService } from "./status-message.service";

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
  private NEXT_REGROUPEMENT: string = "next_regroupement";
  private UPDATE: string = "update";
  private SAVE: string = "save";
  private CLEAR: string = "clear";
  private SEARCH: string = "search";

  constructor(public http: HttpClient,
    private statusMessageService: StatusMessageService
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

  public getNextRegroupement(): Observable<number> {
    return this.httpGet(this.DONNEE + this.NEXT_REGROUPEMENT);
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

  public saveEntityRequest<T extends EntiteSimple>(
    entityName: string,
    entityToSave: T
  ): Observable<PostResponse> {
    return this.httpPost(entityName + "/" + this.SAVE, entityToSave);
  }

  public deleteEntityRequest(
    entityName: string,
    id: number
  ): Observable<PostResponse> {
    return this.httpGet(entityName + "/" + this.DELETE + "?id=" + id);
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

  public saveEntity = <E extends EntiteSimple>(
    entity: E,
    entityName: string
  ): Observable<boolean> => {
    return this.saveEntityRequest(entityName, entity).pipe(
      tap((response: PostResponse) => {
        if (response.isSuccess) {
          this.statusMessageService.showSuccessMessage(
            ENTITIES_PROPERTIES[entityName].theEntityLabelUppercase +
            " a été sauvegardé" +
            (ENTITIES_PROPERTIES[entityName].isFeminine ? "e" : "") +
            " avec succès."
          );
        } else {
          this.statusMessageService.showErrorMessage(
            "Une erreur est survenue pendant la sauvegarde.",
            response.message
          );
        }
      }),
      map((response: PostResponse) => response.isSuccess)
    );
  };

  public deleteEntity = (
    id: number,
    entityName: string
  ): Observable<boolean> => {
    return this.deleteEntityRequest(entityName, id).pipe(
      tap((response: PostResponse) => {
        if (response.isSuccess) {
          this.statusMessageService.showSuccessMessage(
            ENTITIES_PROPERTIES[entityName].theEntityLabelUppercase +
            " a été supprimé" +
            (ENTITIES_PROPERTIES[entityName].isFeminine ? "e" : "") +
            " avec succès."
          );
        } else {
          this.statusMessageService.showErrorMessage(
            "Une erreur est survenue pendant la suppression.",
            response.message
          );
        }
      }),
      map((response: PostResponse) => response.isSuccess)
    );
  };

}
