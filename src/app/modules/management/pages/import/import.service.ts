import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BaseNaturalisteService } from "../../../../services/base-naturaliste.service";

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
