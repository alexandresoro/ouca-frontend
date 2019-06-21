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
  private CREATION: string = "creation/";
  private DATABASE: string = "database/";
  private DELETE: string = "delete";
  private DONNEE: string = "donnee/";
  private EXPORT: string = "export";
  private FIND: string = "find";
  private FIND_WITH_CONTEXT: string = "find_with_context";

  private IMPORT: string = "import";
  private INIT: string = "init";
  private INVENTAIRE: string = "inventaire/";
  private LIEUDIT: string = "lieudit/";
  private NEXT_DONNEE: string = "next_donnee";
  private NEXT_REGROUPEMENT: string = "next_regroupement";
  private PREVIOUS_DONNEE: string = "previous_donnee";
  private UPDATE: string = "update";
  private SAVE: string = "save";
  private SEARCH_BY_COMMUNE: string = "search_by_commune/";

  private readonly FILE_TO_IMPORT_NAME: string = "fileToImport";

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

  public importData(entityName: string, file: File): Observable<string> {
    const formData: FormData = new FormData();
    formData.append(this.FILE_TO_IMPORT_NAME, file, file.name);
    return this.httpPost(entityName + "/" + this.IMPORT, formData);
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

  public getDonneeByIdWithContext(id: number): Observable<any> {
    return this.httpGet(this.DONNEE + this.FIND_WITH_CONTEXT + "?id=" + id);
  }

  public getNextRegroupement(): Observable<number> {
    return this.httpGet(this.DONNEE + this.NEXT_REGROUPEMENT);
  }

  public getLieuxditsByCommuneId(idCommune: number): Observable<Lieudit[]> {
    return this.httpGet(this.LIEUDIT + this.SEARCH_BY_COMMUNE + idCommune);
  }

  public saveDonnee(donneeToSave: Donnee): Observable<Donnee> {
    return this.httpPost(this.DONNEE + this.SAVE, donneeToSave);
  }

  public saveInventaire(
    inventaireToSave: Inventaire
  ): Observable<DbUpdateResult> {
    return this.httpPost(this.INVENTAIRE + this.SAVE, inventaireToSave);
  }

  public getInventaireById(id: number): Observable<any> {
    return this.httpGet(this.INVENTAIRE + this.FIND + "?id=" + id);
  }

  public getEntityInitialPageModel(
    entityName: string
  ): Observable<CreationPage> {
    return this.httpGet(entityName + "/" + this.INIT);
  }

  public saveEntity<T extends EntiteSimple>(
    entityName: string,
    entityToSave: T
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

  public getAllDonnees(): Observable<any[]> {
    return this.httpGet(this.DONNEE + this.ALL);
  }

  public saveDatabase(): Observable<any> {
    return this.httpGet(this.DATABASE + this.SAVE);
  }
}
