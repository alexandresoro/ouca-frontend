import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs";
import { EntiteSimple } from "../../../model/entite-simple.object";
import { BaseNaturalisteService } from "../../../services/base-naturaliste.service";

@Injectable()
export class EntiteSimpleService<T extends EntiteSimple> extends BaseNaturalisteService {

    constructor(public http: Http) {
        super(http);
    }

    public getAllObjects(entityName: string): Observable<any[]> {
        return this.httpGet(entityName + "/all");
    }
}
