import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs";
import { EntiteSimple } from "../../../model/entite-simple.object";
import { BaseNaturalisteService } from "./../../../services/base-naturaliste.service";

@Injectable()
export class EntiteSimpleService<T extends EntiteSimple> {

    constructor(private baseNaturalisteService: BaseNaturalisteService, private http: Http) {
    }

    public getAll(entityName: string): Observable<Response> {
        return this.http.get(this.baseNaturalisteService.BASE_NATURALISTE_URL + entityName + "/all");
    }
}
