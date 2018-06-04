import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";
import { Donnee } from "../../model/donnee.object";
import { Lieudit } from "../../model/lieudit.object";
import { Comportement } from "./../../model/comportement.object";
import { EntiteResult } from "./../../model/entite-result.object";
import { Inventaire } from "./../../model/inventaire.object";
import { BaseNaturalisteService } from "./../../services/base-naturaliste.service";

@Injectable()
export class InventaireService extends BaseNaturalisteService {

    private ENTITY_NAME: string = "creation/inventaire";

    constructor(private http: Http) {
        super();
    }

    public saveObject(objectToSave: Inventaire): Observable<EntiteResult<Inventaire>> {
        objectToSave.date = new Date();
        const action: string = this.ENTITY_NAME + "/create";
        return this.http.post(this.BASE_NATURALISTE_URL + action, objectToSave)
            .map(this.extractModel)
            .catch(this.handleError);
    }

    private extractModel(res: Response): EntiteResult<Inventaire> {
        return res.json();
    }
}
