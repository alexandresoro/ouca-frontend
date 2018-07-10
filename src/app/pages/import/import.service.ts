import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { HttpClient } from "../../../../node_modules/@angular/common/http";
import { Donnee } from "../../model/donnee.object";
import { EntiteResult } from "../../model/entite-result.object";
import { BaseNaturalisteService } from "../../services/base-naturaliste.service";

@Injectable()
export class ImportService extends BaseNaturalisteService {

  private PATH: string = "import/";

  constructor(public http: HttpClient) {
    super(http);
  }

  public importData(fileName: string, dataType: string): Observable<string> {
    return this.httpPost(this.PATH + dataType, fileName);
  }
}
