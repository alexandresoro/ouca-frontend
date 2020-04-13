import { Injectable } from "@angular/core";
import { CreationPage } from "ouca-common/creation-page.object";
import { BehaviorSubject, Observable } from "rxjs";
import { BackendApiService } from "./backend-api.service";
import { StatusMessageService } from "./status-message.service";

@Injectable({
  providedIn: "root",
})
export class CreationPageModelService {
  private creationPage$: BehaviorSubject<CreationPage> = new BehaviorSubject<
    CreationPage
  >(null);

  constructor(
    private backendApiService: BackendApiService,
    private statusMessageService: StatusMessageService
  ) {}

  public refreshPageModel = (): void => {
    this.backendApiService
      .getCreationInitialPageModel()
      .subscribe((creationPage) => {
        console.log("Modèle de la page de création", creationPage);
        if (creationPage?.observateurs) {
          this.creationPage$.next(creationPage);
        } else {
          this.statusMessageService.showErrorMessage(
            "Impossible de charger le contenu la page de Saisie des observations."
          );
        }
      });
  };

  public getCreationPage$ = (): Observable<CreationPage> => {
    return this.creationPage$;
  };
}
