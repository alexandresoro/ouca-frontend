import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";
import { ErrorObservable } from "rxjs/observable/ErrorObservable";
import { CreationPage } from "../../model/creation-page.object";
import { Donnee } from "../../model/donnee.object";
import { Lieudit } from "../../model/lieudit.object";
import { Comportement } from "./../../model/comportement.object";
import { EntiteResult } from "./../../model/entite-result.object";
import { BaseNaturalisteService } from "./../../services/base-naturaliste.service";

@Injectable()
export class CreationService extends BaseNaturalisteService {

  private ENTITY_NAME: string = "creation";

  constructor(public http: Http) {
    super(http);
  }

  public getInitialPageModel(): Observable<CreationPage> {
    return this.callBackend(this.ENTITY_NAME + "/init");
  }

  private extractModel1(res: Response): CreationPage {
    return res.json();
  }

  public getNextDonnee(id: number): Observable<Donnee> {
    return this.http.get(this.BASE_NATURALISTE_URL + this.ENTITY_NAME + "/next_donnee/" + id)
      .map(this.extractDonnee)
      .catch(this.handleError);
  }

  public getPreviousDonnee(id: number): Observable<Donnee> {
    return this.http.get(this.BASE_NATURALISTE_URL + this.ENTITY_NAME + "/previous_donnee/" + id)
      .map(this.extractDonnee)
      .catch(this.handleError);
  }

  public deleteDonnee(id: number): Observable<EntiteResult<Donnee>> {
    return this.callBackend1("/donnee/delete/" + id, this.extractDeleteResponse);
  }

  public getNextRegroupement(): Observable<number> {
    return this.callBackend("/next_regroupement");
  }

  public callBackend1<T>(path: string, actionToPerform: (res: Response) => {}): Observable<T> {
    return this.http.get(this.BASE_NATURALISTE_URL + this.ENTITY_NAME + path)
      .map(actionToPerform)
      .catch(this.handleError);
  }
  private extractDonnee(res: Response): Donnee {
    return res.json();
  }

  private extractDeleteResponse(res: Response): EntiteResult<Donnee> {
    console.log(res);
    return res.json();
  }

  protected handleError(error: Response | any): ErrorObservable {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || "";
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ""} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  /**
   * If the coordinates of the lieudit have been changed, creates a new temporary lieudit with these coordinates and
   * returns it
   * If the coordinates have not been changed, returns the initial lieudit
   * @param lieudit
   * @param altitude
   * @param longitude
   * @param latitude
   * @returns {Lieudit}
   */
  public getRealLieudit(lieudit: Lieudit, altitude: number, longitude: number, latitude: number): Lieudit {
    let realLieudit: Lieudit = lieudit;

    if (this.areCoordinatesChanged(lieudit, altitude, longitude, latitude)) {
      const newLieudit = new Lieudit();
      newLieudit.id = null;
      newLieudit.modeCreation = "TEMPORAIRE";
      newLieudit.commune = lieudit.commune;
      newLieudit.nom = lieudit.nom;
      newLieudit.altitude = altitude;
      newLieudit.longitude = longitude;
      newLieudit.latitude = latitude;

      realLieudit = newLieudit;
    }

    return realLieudit;
  }

  /**
   * Checks if the coordinates of the lieudit have been changed
   * @param lieudit
   * @param altitude
   * @param longitude
   * @param latitude
   * @returns {boolean}
   */
  private areCoordinatesChanged(lieudit: Lieudit, altitude: number, longitude: number, latitude: number): boolean {
    let areCoordinatesChanged: boolean = false;

    if (lieudit.altitude !== altitude ||
      lieudit.longitude !== longitude ||
      lieudit.latitude !== latitude) {
      areCoordinatesChanged = true;
    }

    return areCoordinatesChanged;
  }

  /**
   * Update nombre when estimation nombre has changed
   * If non compte = true then nombre=null
   * If non compte = false and nombre=null, then nombre = defaultNombre
   * If non compte = false and nombre!=null, then we don't update nombre
   * @param donnee
   * @param defaultNombre
   */
  public updateNombreWhenEstimationHasChanged(donnee: Donnee, defaultNombre: number): void {
    const nonCompte: boolean = donnee.estimationNombre.nonCompte;
    if (nonCompte) {
      donnee.nombre = null;
    } else {
      if (donnee.nombre == null) {
        donnee.nombre = defaultNombre;
      }
    }
  }

  public initComportements(): Comportement[] {
    const comportements: Comportement[] = new Array<Comportement>();
    for (let comportementIndex = 0; comportementIndex < 6; comportementIndex++) {
      comportements.push(undefined);
    }
    return comportements;
  }
}
