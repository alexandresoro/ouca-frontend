import { Injectable } from "@angular/core";
import { AppConfiguration } from "ouca-common/app-configuration.object";
import {
  CoordinatesSystem,
  CoordinatesSystemType,
  COORDINATES_SYSTEMS_CONFIG
} from "ouca-common/coordinates-system";
import { Observable, ReplaySubject } from "rxjs";
import { map, tap } from "rxjs/operators";
import { BackendApiService } from "./backend-api.service";
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
    private statusMessageService: StatusMessageService
  ) {}

  public refreshConfiguration = (): void => {
    this.backendApiService
      .getAppConfiguration()
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
          this.refreshConfiguration();
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