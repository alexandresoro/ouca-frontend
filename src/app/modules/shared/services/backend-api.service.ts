import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AppConfiguration } from "basenaturaliste-model/app-configuration.object";
import { ConfigurationPage } from "basenaturaliste-model/configuration-page.object";
import { CreationPage } from "basenaturaliste-model/creation-page.object";
import { DbUpdateResult } from "basenaturaliste-model/db-update-result.object";
import { Donnee } from "basenaturaliste-model/donnee.object";
import { EntiteSimple } from "basenaturaliste-model/entite-simple.object";
import { Inventaire } from "basenaturaliste-model/inventaire.object";
import { Lieudit } from "basenaturaliste-model/lieudit.object";
import { Observable } from "rxjs";

@Injectable()
export class BackendApiService {
  private API_URL: string = "http://localhost:4000/api/";

  private ALL: string = "all";
  private CONFIGURATION: string = "configuration/";
  private CREATE: string = "create";
  private CREATION: string = "creation/";
  private DELETE: string = "delete";
  private DONNEE = "donnee/";
  private EXPORT = "export";
  private IMPORT = "import";
  private INIT: string = "init";
  private INVENTAIRE: string = "inventaire/";
  private LIEUDIT: string = "lieudit/";
  private NEXT_DONNEE = "next_donnee";
  private NEXT_REGROUPEMENT = "next_regroupement";
  private PREVIOUS_DONNEE = "previous_donnee";
  private UPDATE: string = "update";
  private SAVE: string = "save";
  private SEARCH_BY_COMMUNE = "search_by_commune/";

  constructor(public http: HttpClient, private router: Router) {}

  private httpGet<T>(relativePath: string): Observable<T> {
    const requestPath: string = this.API_URL + relativePath;
    console.log("GET ", requestPath);
    return this.http.get<T>(requestPath);
  }

  private httpPost<T>(relativePath: string, objectToPost: any): Observable<T> {
    const requestPath: string = this.API_URL + relativePath;
    console.log("POST", requestPath, objectToPost);
    return this.http.post<T>(requestPath, objectToPost);
  }

  public getConfigurationInitialPageModel(): Observable<ConfigurationPage> {
    return this.httpGet(this.CONFIGURATION + this.INIT);
  }

  public saveAppConfiguration(
    appConfigurationToSave: AppConfiguration
  ): Observable<DbUpdateResult> {
    return this.httpPost(
      this.CONFIGURATION + this.UPDATE,
      appConfigurationToSave
    );
  }

  public importData(fileName: string, dataType: string): Observable<string> {
    return this.httpPost(this.IMPORT + dataType, fileName);
  }

  public getCreationInitialPageModel(): Observable<CreationPage> {
    return this.httpGet(this.CREATION + this.INIT);
  }

  public getNextDonnee(id: number): Observable<Donnee> {
    return this.httpGet(this.DONNEE + this.NEXT_DONNEE + "?id=" + id);
  }

  public getPreviousDonnee(id: number): Observable<Donnee> {
    return this.httpGet(this.DONNEE + this.PREVIOUS_DONNEE + "?id=" + id);
  }

  public deleteDonnee(id: number): Observable<DbUpdateResult> {
    return this.httpGet(this.DONNEE + this.DELETE + "?id=" + id);
  }

  public getNextRegroupement(): Observable<number> {
    return this.httpGet(this.DONNEE + this.NEXT_REGROUPEMENT);
  }

  public getLieuxditsByCommuneId(idCommune: number): Observable<Lieudit[]> {
    return this.httpGet(this.LIEUDIT + this.SEARCH_BY_COMMUNE + idCommune);
  }

  public saveDonnee(donneeToSave: Donnee): Observable<DbUpdateResult> {
    return this.httpPost(this.DONNEE + this.SAVE, donneeToSave);
  }

  public saveInventaire(
    inventaireToSave: Inventaire
  ): Observable<DbUpdateResult> {
    return this.httpPost(this.INVENTAIRE + this.SAVE, inventaireToSave);
  }

  public getEntityInitialPageModel(
    entityName: string
  ): Observable<CreationPage> {
    return this.httpGet(entityName + "/" + this.INIT);
  }

  public saveEntity<T extends EntiteSimple>(
    entityName: string,
    entityToSave: T,
    isUpdate: boolean = false
  ) {
    return this.httpPost(entityName + "/" + this.SAVE, entityToSave);
  }

  public deleteEntity(
    entityName: string,
    id: number
  ): Observable<DbUpdateResult> {
    return this.httpGet(entityName + "/" + this.DELETE + "?id=" + id);
  }

  public getAllEntities(entityName: string): Observable<any[]> {
    return this.httpGet(entityName + "/" + this.ALL);
  }

  public exportAllEntities(entityName: string): Observable<any[]> {
    return this.httpGet(entityName + "/" + this.EXPORT);
  }
}
