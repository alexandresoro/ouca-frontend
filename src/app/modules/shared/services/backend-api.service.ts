import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppConfiguration } from "../../../model/app-configuration.object";
import { ConfigurationPage } from "../../../model/configuration-page.object";
import { CreationPage } from "../../../model/creation-page.object";
import { Donnee } from "../../../model/donnee.object";
import { EntiteResult } from "../../../model/entite-result.object";
import { EntiteSimple } from "../../../model/entite-simple.object";
import { Inventaire } from "../../../model/inventaire.object";
import { Lieudit } from "../../../model/lieudit.object";

@Injectable()
export class BackendApiService {
  private API_URL: string = "http://localhost:4000/api/";

  private ALL: string = "all";
  private CONFIGURATION: string = "configuration/";
  private CREATE: string = "create";
  private CREATION: string = "creation";
  private DELETE: string = "delete/";
  private DONNEE = "donnee/";
  private EXPORT = "export";
  private IMPORT = "import";
  private INIT: string = "init";
  private INVENTAIRE: string = "inventaire/";
  private LIEUDIT: string = "lieudit/";
  private NEXT_DONNEE = "next_donnee/";
  private NEXT_REGROUPEMENT = "next_regroupement";
  private PREVIOUS_DONNEE = "previous_donnee/";
  private UPDATE: string = "update";
  private SEARCH_BY_COMMUNE = "search_by_commune/";

  constructor(public http: HttpClient) {}

  private httpGet<T>(path: string): Observable<T> {
    return this.http.get<T>(this.API_URL + path);
  }

  private httpPost<T>(relativePath: string, objectToPost: any): Observable<T> {
    return this.http.post<T>(this.API_URL + relativePath, objectToPost);
  }

  public getConfigurationInitialPageModel(): Observable<ConfigurationPage> {
    return this.httpGet(this.CONFIGURATION + this.INIT);
  }

  public saveAppConfiguration(
    appConfigurationToSave: AppConfiguration
  ): Observable<EntiteResult<AppConfiguration>> {
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
    return this.httpGet(this.DONNEE + this.NEXT_DONNEE + id);
  }

  public getPreviousDonnee(id: number): Observable<Donnee> {
    return this.httpGet(this.DONNEE + this.PREVIOUS_DONNEE + id);
  }

  public deleteDonnee(id: number): Observable<EntiteResult<Donnee>> {
    return this.httpGet(this.DONNEE + this.DELETE + id);
  }

  public getNextRegroupement(): Observable<number> {
    return this.httpGet(this.DONNEE + this.NEXT_REGROUPEMENT);
  }

  public getLieuxditsByCommuneId(idCommune: number): Observable<Lieudit[]> {
    return this.httpGet(this.LIEUDIT + this.SEARCH_BY_COMMUNE + idCommune);
  }

  public saveDonnee(donneeToSave: Donnee): Observable<EntiteResult<Donnee>> {
    return this.httpPost(this.DONNEE + this.CREATE, donneeToSave);
  }

  public saveInventaire(
    inventaireToSave: Inventaire
  ): Observable<EntiteResult<Inventaire>> {
    return this.httpPost(this.INVENTAIRE + this.CREATE, inventaireToSave);
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
    if (!!!isUpdate) {
      return this.httpPost(entityName + "/" + this.CREATE, entityToSave);
    } else {
      return this.httpPost(entityName + "/" + this.UPDATE, entityToSave);
    }
  }

  public deleteEntity(
    entityName: string,
    id: number
  ): Observable<EntiteResult<EntiteSimple>> {
    return this.httpGet(entityName + "/" + this.DELETE + id);
  }

  public getAllEntities(entityName: string): Observable<any[]> {
    return this.httpGet(entityName + "/" + this.ALL);
  }

  public exportAllEntities(entityName: string): Observable<any[]> {
    return this.httpGet(entityName + "/" + this.EXPORT);
  }
}
