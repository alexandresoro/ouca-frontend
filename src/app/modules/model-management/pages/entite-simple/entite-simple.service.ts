import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { EntiteSimple } from "../../../../model/entite-simple.object";
import { BaseNaturalisteService } from "../../../../services/base-naturaliste.service";

@Injectable()
export class EntiteSimpleService<
  T extends EntiteSimple
> extends BaseNaturalisteService {
  constructor(public http: HttpClient) {
    super(http);
  }

  public getAllObjects(entityName: string): Observable<any[]> {
    return this.httpGet(entityName + "/all");
  }

  public exportAllObjects(entityName: string): Observable<any[]> {
    return this.httpGet(entityName + "/export");
  }
}
