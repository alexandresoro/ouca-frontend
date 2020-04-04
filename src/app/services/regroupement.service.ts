import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { BackendApiService } from "./backend-api.service";

@Injectable({
  providedIn: "root",
})
export class RegroupementService {
  private nextRegroupement$: Subject<number> = new Subject<number>();

  constructor(private backendApiService: BackendApiService) {}

  public getNextRegroupement$ = (): Observable<number> => {
    return this.nextRegroupement$;
  };

  public updateNextRegroupement(): void {
    this.backendApiService
      .getNextRegroupement()
      .subscribe((regroupement: number) => {
        this.nextRegroupement$.next(regroupement);
      });
  }
}
