import { Injectable } from "@angular/core";
import { CreationPage } from "ouca-common/creation-page.object";
import { Donnee } from "ouca-common/donnee.object";
import { Inventaire } from "ouca-common/inventaire.object";
import { PostResponse } from "ouca-common/post-response.object";
import { BehaviorSubject, Observable } from "rxjs";
import { filter } from "rxjs/operators";
import { BackendApiService } from "./backend-api.service";
import { StatusMessageService } from "./status-message.service";

@Injectable({
  providedIn: "root"
})
export class CreationPageService {
  private creationPage$: BehaviorSubject<CreationPage> = new BehaviorSubject<
    CreationPage
  >(null);

  constructor(
    private backendApiService: BackendApiService,
    private statusMessageService: StatusMessageService
  ) {}

  public getCreationPage$ = (): Observable<CreationPage> => {
    return this.creationPage$.pipe(filter((creationPage) => !!creationPage));
  };

  public initializeCreationPage = (): void => {
    this.backendApiService
      .getCreationInitialPageModel()
      .subscribe((creationPage) => {
        console.log("Modèle de la page de création", creationPage);
        this.creationPage$.next(creationPage);
      });
  };

  public saveInventaire = (inventaire: Inventaire): void => {
    this.backendApiService
      .saveInventaire(inventaire)
      .subscribe((response: PostResponse) => {
        if (response.isSuccess) {
          // TO DO
        } else {
          this.statusMessageService.showErrorMessage(
            "Une erreur est survenue pendant la sauvegarde de l'inventaire: " +
              response.message
          );
        }
      });
  };

  public saveDonnne = (donnee: Donnee): void => {
    this.backendApiService
      .saveDonnee(donnee)
      .subscribe((response: PostResponse) => {
        if (response.isSuccess) {
          // TO DO
        } else {
          this.statusMessageService.showErrorMessage(
            "Une erreur est survenue pendant la sauvegarde de la donnée: " +
              response.message
          );
        }
      });
  };
}
