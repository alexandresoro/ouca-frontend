import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { Donnee } from "./../../model/donnee.object";
import { EntiteResult } from "./../../model/entite-result.object";
import { BaseNaturalisteService } from "./../../services/base-naturaliste.service";

@Injectable()
export class DonneeService extends BaseNaturalisteService {

    private ENTITY_NAME: string = "creation/donnee";

    constructor(public http: Http) {
        super(http);
    }

    public saveObject(objectToSave: Donnee): Observable<EntiteResult<Donnee>> {
        const action: string = this.ENTITY_NAME + "/create";
        return this.http.post(this.BASE_NATURALISTE_URL + action, objectToSave)
            .map(this.extractModel)
            .catch(this.handleError);
    }
}
