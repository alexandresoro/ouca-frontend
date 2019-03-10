import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Donnee } from "../../../../model/donnee.object";
import { EntiteResult } from "../../../../model/entite-result.object";
import { BaseNaturalisteService } from "../../../../services/base-naturaliste.service";

@Injectable()
export class DonneeService extends BaseNaturalisteService {
  private ENTITY_NAME: string = "creation/donnee";

  constructor(public http: HttpClient) {
    super(http);
  }

  public saveDonnee(donneeToSave: Donnee): Observable<EntiteResult<Donnee>> {
    return this.httpPost(this.ENTITY_NAME + "/create", donneeToSave);
  }
}
