import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BackendApiService } from "./backend-api.service";

@Injectable({
  providedIn: "root"
})
export class RegroupementService {
  constructor(private backendApiService: BackendApiService) {}

  public updateNextRegroupement(): Observable<number> {
    return this.backendApiService.getNextRegroupement();
  }
}
