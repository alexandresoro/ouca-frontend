import { Injectable } from "@angular/core";
import { AppConfiguration } from "@ou-ca/ouca-model/app-configuration.object";
import {
  CoordinatesSystem,
  CoordinatesSystemType,
  COORDINATES_SYSTEMS_CONFIG
} from "@ou-ca/ouca-model/coordinates-system";
import { Observable, ReplaySubject } from "rxjs";
import { filter, map, tap } from "rxjs/operators";
import { BackendApiService } from "./backend-api.service";
import { BackendWsService } from "./backend-ws.service";
import { StatusMessageService } from "./status-message.service";

@Injectable({
  providedIn: "root"
})
export class AppConfigurationService {
  private configuration$: ReplaySubject<AppConfiguration> = new ReplaySubject<
    AppConfiguration
  >(1);

  constructor(
    private backendApiService: BackendApiService,
    private statusMessageService: StatusMessageService,
    private backendWsService: BackendWsService
  ) { }

  public initializeConfigurationStore = (): void => {
    this.backendWsService
      .getUpdateMessageContent$()
      .pipe(
        filter((updateContent) => !!updateContent.configuration),
        map((updateContent) => {
          return updateContent.configuration;
        })
      )
      .subscribe((appConfiguration) => {
        this.configuration$.next(appConfiguration);
      });
  };

  public saveAppConfiguration = (
    newAppConfiguration: AppConfiguration
  ): Observable<boolean> => {
    return this.backendApiService
      .saveAppConfiguration(newAppConfiguration)
      .pipe(
        tap((isSuccessful) => {
          if (isSuccessful) {
            this.statusMessageService.showSuccessMessage(
              "La configuration de l'application a été mise à jour."
            );
          } else {
            this.statusMessageService.showErrorMessage(
              "Une erreur est survenue pendant la sauvegarde de la configuration."
            );
          }
        })
      );
  };

  public getConfiguration$ = (): Observable<AppConfiguration> => {
    return this.configuration$.asObservable();
  };

  public getAppCoordinatesSystemType$ = (): Observable<
    CoordinatesSystemType
  > => {
    return this.configuration$.pipe(
      map((configuration) => configuration?.coordinatesSystem)
    );
  };

  public getAppCoordinatesSystem$ = (): Observable<CoordinatesSystem> => {
    return this.configuration$.pipe(
      map(
        (configuration) =>
          COORDINATES_SYSTEMS_CONFIG[configuration?.coordinatesSystem]
      )
    );
  };
}
