import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { EntiteResult } from "../../model/entite-result.object";
import { Inventaire } from "../../model/inventaire.object";
import { BaseNaturalisteService } from "../../services/base-naturaliste.service";

@Injectable()
export class InventaireService extends BaseNaturalisteService {

    private ENTITY_NAME: string = "creation/inventaire";

    constructor(public http: Http) {
        super(http);
    }

    public saveInventaire(inventaireToSave: Inventaire): Observable<EntiteResult<Inventaire>> {
        inventaireToSave.date = new Date();
        return this.httpPost(this.ENTITY_NAME + "/create", inventaireToSave);
    }
}
