import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { EntiteResult } from "./../../model/entite-result.object";
import { Inventaire } from "./../../model/inventaire.object";
import { BaseNaturalisteService } from "./../../services/base-naturaliste.service";

@Injectable()
export class InventaireService extends BaseNaturalisteService {

    private ENTITY_NAME: string = "creation/inventaire";

    constructor(public http: Http) {
        super(http);
    }

    public saveObject(objectToSave: Inventaire): Observable<EntiteResult<Inventaire>> {
        objectToSave.date = new Date();
        const action: string = this.ENTITY_NAME + "/create";
        return this.http.post(this.BASE_NATURALISTE_URL + action, objectToSave).pipe(
            map(this.extractModel),
            catchError(this.handleError)
        );
    }
}
