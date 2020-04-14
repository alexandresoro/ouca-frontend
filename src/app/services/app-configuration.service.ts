import { Injectable } from "@angular/core";
import { AppConfiguration } from "ouca-common/app-configuration.object";
import {
  CoordinatesSystem,
  CoordinatesSystemType,
  COORDINATES_SYSTEMS_CONFIG
} from "ouca-common/coordinates-system";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { BackendApiService } from "./backend-api.service";
import { StatusMessageService } from "./status-message.service";

@Injectable({
  providedIn: "root"
})
export class AppConfigurationService {
  private configuration$: BehaviorSubject<
    AppConfiguration
  > = new BehaviorSubject<AppConfiguration>({} as AppConfiguration);

  constructor(
    private backendApiService: BackendApiService,
    private statusMessageService: StatusMessageService
  ) {}

  public refreshConfiguration = (): void => {
    const configuration$ = this.backendApiService.getAppConfiguration();

    configuration$.subscribe((configuration: AppConfiguration) => {
      this.configuration$.next(configuration);
    });
  };

  public saveAppConfiguration = (
    newAppConfiguration: AppConfiguration
  ): Observable<boolean> => {
    const saveApp$ = this.backendApiService.saveAppConfiguration(
      newAppConfiguration
    );

    saveApp$.subscribe((isSuccessful) => {
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
    });

    return saveApp$.pipe(
      map((isSuccessful) => {
        return isSuccessful;
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

  public getAppCoordinatesSystemType = (): CoordinatesSystemType => {
    return this.configuration$.value.coordinatesSystem;
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
