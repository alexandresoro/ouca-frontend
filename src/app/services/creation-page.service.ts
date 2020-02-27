import { Injectable } from "@angular/core";
import { CreationPage } from "ouca-common/creation-page.object";
import { BehaviorSubject, Observable } from "rxjs";
import { filter } from "rxjs/operators";
import { BackendApiService } from "../modules/shared/services/backend-api.service";

@Injectable({
  providedIn: "root"
})
export class CreationPageService {
  private creationPage$: BehaviorSubject<CreationPage> = new BehaviorSubject<
    CreationPage
  >(null);

  constructor(private backendApiService: BackendApiService) {}

  public getCreationPage$ = (): Observable<CreationPage> => {
    return this.creationPage$.pipe(filter(creationPage => !!creationPage));
  };

  public getCreationPage = (): CreationPage => {
    return this.creationPage$.value;
  };

  public initializeCreationPage = (): void => {
    this.backendApiService
      .getCreationInitialPageModel()
      .subscribe(creationPage => {
        console.log("Modèle de la page de création", creationPage);
        this.creationPage$.next(creationPage);
      });
  };
}
