import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";
import { CreationPage } from "../../model/creation-page.object";
import { Donnee } from "../../model/donnee.object";
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
    return this.httpGet(this.ENTITY_NAME + "/init");
  }

  public getNextDonnee(id: number): Observable<Donnee> {
    return this.httpGet(this.ENTITY_NAME + "/next_donnee/" + id);
  }

  public getPreviousDonnee(id: number): Observable<Donnee> {
    return this.httpGet(this.ENTITY_NAME + "/previous_donnee/" + id);
  }

  public deleteDonnee(id: number): Observable<EntiteResult<Donnee>> {
    return this.httpGet(this.ENTITY_NAME + "/donnee/delete/" + id);
  }

  public getNextRegroupement(): Observable<number> {
    return this.httpGet(this.ENTITY_NAME + "/next_regroupement");
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
