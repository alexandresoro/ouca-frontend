import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { HttpClient } from "../../../../node_modules/@angular/common/http";
import { EntiteResult } from "../../model/entite-result.object";
import { Inventaire } from "../../model/inventaire.object";
import { BaseNaturalisteService } from "../../services/base-naturaliste.service";

@Injectable()
export class InventaireService extends BaseNaturalisteService {
  private ENTITY_NAME: string = "creation/inventaire";

  constructor(public http: HttpClient) {
    super(http);
  }

  public saveInventaire(
    inventaireToSave: Inventaire
  ): Observable<EntiteResult<Inventaire>> {
    console.log("L'inventaire à sauvegarder est", inventaireToSave);
    return this.httpPost(this.ENTITY_NAME + "/create", inventaireToSave);
  }
}
